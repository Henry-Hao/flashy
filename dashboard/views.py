from django.shortcuts import render, reverse
from django.http.response import HttpResponse, Http404, HttpResponseForbidden, HttpResponseServerError, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.contrib.auth import login as authlogin, authenticate, logout as authlogout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import ObjectDoesNotExist
from flashy.settings import BASE_DIR
from dashboard.models import Card, Session, Account, Tag
from dashboard import error_code as ERRORCODE
import os
import json
import itertools
from urllib.parse import unquote as decodeURIComponent

# Create your views here.

@csrf_exempt
def index(request):
    if request.user.is_authenticated:
        return TemplateResponse(request, 'home.html')
    else:
        return TemplateResponse(request, 'login.html')

def extract_card_pk(cards):
    return [card.pk for card in cards]

def refreshSession(request):
    request.session['cards'] = extract_card_pk(Card.objects.all())

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
    refreshSession(request)
    return HttpResponse("success")

def logout(request):
    authlogout(request)
    return HttpResponseRedirect(reverse('index'))

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
            session = request.user.account.Session
            try:
                card = Card.objects.get(pk=json.loads(request.body.decode())['id'])
                session.KnownCard.add(card)
                session.save()
                return HttpResponse('success')
            except Exception:
                return HttpResponseServerError()
        elif action == 'getAllCards' and request.method == 'POST':
            if request.body == b'':
                cards = [card.as_dict() for card in Card.objects.all()]
            else:
                tags = decodeURIComponent(json.loads(request.body.decode())['tags']).split(',')
                if len(tags) == 1 and tags[0] == '':
                    cards = cards = [card.as_dict() for card in Card.objects.all()]
                else:
                    cards = Card.objects.filter(Tag__pk__in=tags).distinct()
                    cards = [card.as_dict() for card in cards]
            return HttpResponse(json.dumps(cards), content_type="text/json")
        elif action == 'getAllTags' and request.method == 'GET':
            tags = [tag.as_dict() for tag in Tag.objects.all()]
            return HttpResponse(json.dumps(tags),content_type="text/json")
        elif action == 'updateCard' and request.method == 'PUT':
            card = json.loads(request.body.decode())
            try:
                card_db = Card.objects.get(pk=card['id'])
                card_db.Description = card['desc']
                card_db.Anwser = card['anwser']
                card_db.Hints = card['hints']
                card_db.Tag.clear()
                for tag_id in card['tag']:
                    try:
                        tag = Tag.objects.get(pk=tag_id)
                        card_db.Tag.add(tag)
                    except Exception as e:
                        pass
                card_db.save()
                return HttpResponse('success')
            except ObjectDoesNotExist:
                print("Object doesn't exist while updating card:%s", card['id'])
        elif action == 'createCard' and request.method == 'POST':
            card = json.loads(request.body.decode())
            try:
                card_db = Card.objects.create(Description=card['desc'],Anwser=card['anwser'], Hints = card['hints'])
                card_db.Tag.clear()
                for tag_id in card['tag']:
                    try:
                        tag = Tag.objects.get(pk=tag_id)
                        card_db.Tag.add(tag)
                    except Exception as e:
                        pass
                card_db.save()
                # update cards in the session
                refreshSession(request)
                return HttpResponse('success')
            except Exception:
                print("Create new card failed:%s", card)
        elif action == 'deleteCard' and request.method == 'PUT':
            id = request.body.decode()
            try:
                card = Card.objects.get(pk=id)
                card.delete()
                refreshSession(request)
                return HttpResponse('success')
            except Exception:
                print("Delete card failed:%s", id)
        elif action == 'deleteTag' and request.method == 'DELETE':
            id = request.GET['id']
            try:
                tag = Tag.objects.get(pk=id)
                tag.delete()
                refreshSession(request)
                return HttpResponse('success')
            except Exception:
                print("Delete tag failed:%s", id)
        elif action == 'createTag' and request.method == 'POST':
            tag_desc = json.loads(request.body.decode())['tag']
            try:
                exist = Tag.objects.filter(Description__iexact=tag_desc)
                if len(Tag.objects.filter(Description__iexact=tag_desc)) != 0:
                    return HttpResponse(json.dumps({'error':ERRORCODE.TAG_DUPLICATE}), content_type="text/json")
                tag = Tag.objects.create(Description=tag_desc)
                return HttpResponse('success')
            except Exception:
                print("Create tag failed:%s", tag_desc)

        return HttpResponseServerError()