from django.conf.urls import url
from dashboard import views as dashboard

urlpatterns = [
    url(r'^$',dashboard.index, name='index'),
    url(r'^login$',dashboard.login, name='login'),
    url(r'^logout$',dashboard.logout, name='logout'),
    url(r'^api/(?P<action>.*)$',dashboard.api),
    url(r'^template/(?P<filename>.*\.html)$', dashboard.get_template)
]