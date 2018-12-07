from django.shortcuts import render
from django.http.response import HttpResponse, Http404, HttpResponseForbidden, HttpResponseServerError
from django.template.response import TemplateResponse
from django.contrib.auth import login as authlogin, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from flashy.settings import BASE_DIR
from dashboard.models import Card, Session, Account, Tag
from dashboard import error_code as ERRORCODE
import os
import json
import itertools

# Create your views here.

@csrf_exempt
def index(request):
    if request.user.is_authenticated:
        return TemplateResponse(request, 'home.html')
    else:
        return TemplateResponse(request, 'login.html')

def extract_card_pk(cards):
    return [card.pk for card in cards]


def login(request):
    if request.method != 'POST':
        return HttpResponseForbidden('Methond not supported')
    
    args = json.loads(request.body.decode())
    username = args['username']
    password = args['password']

    user = authenticate(username=username,password=password)
    if user is None:
        return HttpResponseForbidden('Authentication failed')

    authlogin(request, user)
    request.session['cards'] = extract_card_pk(Card.objects.all())
    return HttpResponse("success")

def get_template(request, filename=""):
    filename = os.path.join(BASE_DIR, 'template',filename.lower())
    html = ''
    try:
        with open(filename,'r', encoding='utf-8') as f:
            html = f.read()
        return HttpResponse(html, content_type="text/html")
    except Exception as e:
        return HttpResponseServerError()

def api(request,action=None):
    pass
    if action is None:
        return HttpResponseServerError()
    else:
        if action == 'getNextCard' and request.method == 'GET':
            if 'cards' in request.session:
                if len(request.session['cards']) > 0:
                    card_id = request.session['cards'].pop()
                    card = Card.objects.get(pk=card_id)
                    knownCards = request.user.account.Session.KnownCard.all()
                    if Card.objects.count() == len(knownCards):
                        return HttpResponse(json.dumps({'error':ERRORCODE.CARDS_EMPTY}),content_type="text/json")
                    while card in knownCards:
                        if len(request.session['cards']) <= 0:
                            return HttpResponse(json.dumps({'error':ERRORCODE.CARDS_EMPTY}),content_type="text/json")
                        card_id = request.session['cards'].pop()
                        card = Card.objects.get(pk=card_id)
                    request.session['cards'].insert(0,card.pk)
                    return HttpResponse(json.dumps(card.as_dict()), content_type="text/json")
                else:
                    return HttpResponse(json.dumps({'error':ERRORCODE.CARDS_EMPTY}),content_type="text/json")
        elif action == 'getFirstCard' and request.method == 'GET':
            if 'cards' in request.session:
                if len(request.session['cards']) > 0:
                    card = Card.objects.get(pk=request.session['cards'][0])
                    knownCards = request.user.account.Session.KnownCard.all()
                    if Card.objects.count() == len(knownCards):
                        return HttpResponse(json.dumps({'error':ERRORCODE.CARDS_EMPTY}),content_type="text/json")
                    while card in knownCards:
                        request.session['cards'].pop()
                        card = Card.objects.get(pk=request.session['cards'][0])
                    return HttpResponse(json.dumps(card.as_dict()), content_type="text/json")
                else:
                    return HttpResponse(json.dumps({'error':ERRORCODE.CARDS_EMPTY}),content_type="text/json")
        elif action == 'knowACard' and request.method == 'PUT':
            session = request.user.account.Session;
            try:
                card = Card.objects.get(pk=json.loads(request.body.decode())['id'])
                session.KnownCard.add(card)
                session.save()
                return HttpResponse('success')
            except Exception:
                return HttpResponseServerError()

        return HttpResponseServerError()