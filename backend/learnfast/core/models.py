#from django.db import models
#from django.contrib.auth.models import User

""" class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
 """    
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

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
