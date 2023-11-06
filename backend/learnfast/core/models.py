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
        self.api = "api_django_python_hello-world"
        self.branch = "basic-authorization"