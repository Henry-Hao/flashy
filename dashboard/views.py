from django.shortcuts import render
from django.http.response import HttpResponse, Http404
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from flashy.settings import BASE_DIR
import os

# Create your views here.


def login(request):
    return TemplateResponse(request, 'login.html')


def index(request):
    return TemplateResponse(request, 'index.html')

def get_template(request, filename=""):
    filename = os.path.join(BASE_DIR, filename.lower())
    try:
        a = open(filename,'rb')
        return TemplateResponse(filename)
    except Exception as e:
        return Http404()