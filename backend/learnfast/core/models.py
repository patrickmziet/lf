class Message:
    def __init__(self, text=""):
        self.metadata = Metadata()
        self.text = text


class Metadata:
    def __init__(self):
        self.api = "api_django_python_learnfast"
        self.branch = "basic-authorization"


import os
import shutil
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
import time
import logging

class User(AbstractUser):
    id = models.CharField(primary_key=True, max_length=255)  # This will store the 'sub' from Auth0 profile
    sub = models.CharField(max_length=255, unique=True, default="")  # This will store the 'sub' from Auth0 profile
    email = models.EmailField(unique=True)
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


class Topic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=255)
    card_msg_chain = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def delete(self, *args, **kwargs):
        # Path to the folder containing the documents for this topic
        folder_path = os.path.join(settings.MEDIA_ROOT, f'user_{self.user.id}/topic_{self.id}')

        for document in self.documents.all():
            document.delete()  # This will call delete method of Document model

        # Delete the entire folder
        if os.path.exists(folder_path) and os.path.isdir(folder_path):
            shutil.rmtree(folder_path)
        
        super().delete(*args, **kwargs)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/topic_{1}/{2}'.format(instance.topic.user.id, instance.topic.id, filename)

class Document(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # log that a document was uploaded
    logging.info(f"Document uploaded: {document}")

    def delete(self, *args, **kwargs):
        self.document.delete(save=False)  # delete the actual file
        super().delete(*args, **kwargs)  # call the original delete method


class Flashcard(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='flashcards')
    question = models.TextField()
    answer = models.TextField()
    easiness = models.FloatField(default=2.4)
    interval = models.IntegerField(default=1)
    repetitions = models.IntegerField(default=0)
    record = models.TextField(default="")
    due_date = models.FloatField(default=time.time() - 1 * 60)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def update(self, correct):
        if correct:
            self.record += "1"
            self.repetitions += 1

            if self.repetitions == 1:
                self.interval = 10 * 60
            elif self.repetitions == 2:
                self.interval = 1 * 24 * 60 * 60
            elif self.repetitions == 3:
                self.interval = 3 * 24 * 60 * 60
            else:
                self.interval = round(self.interval * self.easiness)
        else:
            self.record += "0"
            self.repetitions = 0
            self.interval = 1 * 60
        self.updated_at = time.time()
        self.due_date = time.time() + self.interval

    def is_due(self):
        return self.due_date <= time.time() + 15 * 60

    def due_date_str(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(self.due_date))

    def get_string(self):
        return f"Question: {self.question} | Answer: {self.answer} | Easiness: {self.easiness} | Interval: {self.interval} | Repetitions: {self.repetitions} | Record: {self.record} | Due date: {self.due_date_str()}"

    def to_json(self):
        return {
            "topic": self.topic.id,
            "question": self.question,
            "answer": self.answer,
            "easiness": self.easiness,
            "interval": self.interval,
            "repetitions": self.repetitions,
            "record": self.record,
            "due_date": self.due_date_str(),
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Chat(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='chats')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)


class Test(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='tests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)


class Rubric(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='rubrics')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)