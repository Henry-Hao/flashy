from django.contrib import admin
from dashboard.models import Account,Session,Tag,Card

# Register your models here.
admin.site.register(Account)
admin.site.register(Session)
admin.site.register(Tag)
admin.site.register(Card)