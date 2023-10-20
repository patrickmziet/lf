from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from .models import Note
from .serializers import NoteSerializer
from django.urls import reverse
import json

class BaseViewTest(APITestCase):
    client = APIClient()

    @staticmethod
    def create_note(title="", content="", user=None):
        if user:
            Note.objects.create(title=title, content=content, user=user)

    def setUp(self):
        # create a user
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )
        # create a note
        self.create_note("test title", "test content", self.user)

class NoteListCreateTest(BaseViewTest):

    def test_list_notes(self):
        self.client.force_authenticate(user=self.user)
        # hit the API endpoint
        response = self.client.get(
            reverse("note-list-create"),
            format="json"
        )
        # fetch the data from db
        expected = Note.objects.all()
        serialized = NoteSerializer(expected, many=True)
        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_note(self):
        self.client.force_authenticate(user=self.user)
        # hit the API endpoint
        response = self.client.post(
            reverse("note-list-create"),
            data=json.dumps({
                "title": "test title 2",
                "content": "test content 2",
                "user": self.user.id
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)