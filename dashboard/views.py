from django.shortcuts import render
from django.http.response import HttpResponse, Http404, HttpResponseForbidden
from django.template.response import TemplateResponse
from django.contrib.auth import login as authlogin, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from flashy.settings import BASE_DIR
import os
import json

# Create your views here.

@csrf_exempt
def index(request):
    if request.user.is_authenticated:
        return TemplateResponse(request, 'index.html')
    else:
        return TemplateResponse(request, 'login.html')


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
    return HttpResponse("success")

def get_template(request, filename=""):
    filename = os.path.join(BASE_DIR, 'template',filename.lower())
    html = ''
    try:
        with open(filename,'r', encoding='utf-8') as f:
            html = f.read()
        return HttpResponse(html, content_type="text/html")
    except Exception as e:
        return Http404()