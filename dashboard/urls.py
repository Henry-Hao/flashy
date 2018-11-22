from django.conf.urls import url
from dashboard import views as dashboard

urlpatterns = [
    url(r'^index$',dashboard.index, name='dashboard_index')
]