from django.conf.urls import url
from dashboard import views as dashboard

urlpatterns = [
    url(r'^login$',dashboard.login, name='login'),
    url(r'^$',dashboard.index, name='index'),
    url(r'^template/(?P<filename>.*\.html)$', dashboard.get_template)
]