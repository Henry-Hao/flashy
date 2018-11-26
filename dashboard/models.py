from django.db import models

# Create your models here.

class Tag(models.Model):
    Description = models.TextField(max_length=64)


class Card(models.Model):
    Description = models.CharField(max_length=256)
    Hints = models.CharField(max_length=256, null=True)
    Answer = models.CharField(max_length=1024)
    Tag = models.ManyToManyField(Tag)

class Session(models.Model):
    Description = models.CharField(max_length=128)
    knownCard = models.CharField(max_length=1024)

