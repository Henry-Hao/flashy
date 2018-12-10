from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tag(models.Model):
    Description = models.CharField(max_length=64)

    def __str__(self):
        return self.Description

    def as_dict(self):
        return {
            'id':self.pk,
            'desc':self.Description
        }


class Card(models.Model):
    Description = models.CharField(max_length=256)
    Hints = models.CharField(max_length=256, null=True, blank=True)
    Anwser = models.CharField(max_length=1024)
    Tag = models.ManyToManyField(Tag)
    Updated = models.DateField(auto_now=True)

    def __str__(self):
        return self.Description

    def as_dict(self):
        ret = {
            "id":self.pk,
            "description":self.Description,
            "hints":self.Hints,
            "anwser":self.Anwser,
            "tag":[],
            "updated":str(self.Updated)
        }

        for tag in self.Tag.all():
            ret['tag'].append(str(tag.id))
        
        ret['tag'] = ",".join(ret['tag'])
        return ret

class Session(models.Model):
    Description = models.CharField(max_length=128)
    KnownCard = models.ManyToManyField(Card)

    def __str__(self):
        return self.Description

class Account(models.Model):
    User = models.OneToOneField(User, on_delete=models.CASCADE)
    Session = models.ForeignKey(Session, on_delete=models.CASCADE)

    def __str__(self):
        return self.User.username + ":" + str(self.Session)