class Message:
    def __init__(self, text=""):
        self.metadata = Metadata()
        self.text = text


class Metadata:
    def __init__(self):
        self.api = "api_django_python_learnfast"
        self.branch = "basic-authorization"


from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
#import uuid

class User(AbstractUser):
    id = models.CharField(primary_key=True, max_length=255)  # This will store the 'sub' from Auth0 profile
    sub = models.CharField(max_length=255, unique=True, default="")  # This will store the 'sub' from Auth0 profile
    email = models.EmailField(unique=True)
    #username = models.CharField(max_length=255, unique=True)
    is_verified = models.BooleanField(default=False)
    given_name = models.CharField(max_length=255, null=True, blank=True)
    family_name = models.CharField(max_length=255, null=True, blank=True)
    nickname = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    picture = models.URLField(null=True, blank=True)
    locale = models.CharField(max_length=10, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                             on_delete=models.CASCADE, 
                             related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


#from django.db import models
#from django.contrib.auth.models import User

""" class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
 """    