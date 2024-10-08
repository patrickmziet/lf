""" from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from authz.tokens import Auth0Token

from .models import Note

class NoteApiTestCase(APITestCase):
def setUp(self):
    self.user = User.objects.create_user(username='testuser', password='testpassword')
    self.note_url = reverse('note-list')
    self.token = str(Auth0Token.for_user(self.user))

def test_create_note_unauthenticated(self):
    response = self.client.post(self.note_url, {'title': 'Test Note', 'content': 'Test Content'})

    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

def test_create_note_authenticated(self):
    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    response = self.client.post(self.note_url, {'title': 'Test Note', 'content': 'Test Content'})

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Note.objects.count(), 1)
    self.assertEqual(Note.objects.get().title, 'Test Note')

def test_retrieve_notes_unauthenticated(self):
    response = self.client.get(self.note_url)

    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

def test_retrieve_notes_authenticated(self):
    Note.objects.create(user=self.user, title='Test Note', content='Test Content')
    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    response = self.client.get(self.note_url)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 1)
    self.assertEqual(response.data[0]['title'], 'Test Note')
 """

from time import time
from unittest.mock import patch

from django.test import SimpleTestCase
from rest_framework.reverse import reverse
from rest_framework_simplejwt.backends import TokenBackend

from core.views import (
    PublicMessageApiView, ProtectedMessageApiView, AdminMessageApiView
)

VALID_TOKEN_PAYLOAD = {
    "iss": "https://my-domain.us.auth0.com/",
    "sub": "user@clients",
    "aud": "https://api.example.com",
    "iat": time(),
    "exp": time() + 3600,
    "azp": "mK3brgMY0GIMox40xKWcUZBbv2Xs0YdG",
    "scope": "read:messages",
    "gty": "client-credentials",
    "permissions": [],
}


class PublicMessageApiViewTest(SimpleTestCase):

    def test_public_api_view_returns_ok(self):
        response = self.client.get(reverse('public-message'))

        self.assertEqual(response.status_code, 200)
        d = response.json()
        self.assertDictEqual({'text': d.get('text')}, {'text': PublicMessageApiView.text})


class ProtectedMessageApiViewTest(SimpleTestCase):

    def test_protected_api_view_without_token_returns_unauthorized(self):
        response = self.client.get(reverse('protected-message'))

        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'message': 'Authentication credentials were not provided.'}
        )

    def test_protected_api_view_with_invalid_token_returns_unauthorized(self):
        response = self.client.get(
            reverse('protected-message'), HTTP_AUTHORIZATION="Bearer invalid-token"
        )

        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'message': "Given token not valid for any token type"}
        )

    @patch.object(TokenBackend, 'decode')
    def test_protected_api_view_with_valid_token_returns_ok(self, mock_decode):
        mock_decode.return_value = VALID_TOKEN_PAYLOAD

        response = self.client.get(
            reverse('protected-message'), HTTP_AUTHORIZATION="Bearer valid-token"
        )

        self.assertEqual(response.status_code, 200)
        d = response.json()
        self.assertDictEqual({'text': d.get('text')}, {'text': ProtectedMessageApiView.text})


class AdminMessageApiViewTest(SimpleTestCase):

    def test_admin_api_view_without_token_returns_unauthorized(self):
        response = self.client.get(reverse('admin-message'))

        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'message': 'Authentication credentials were not provided.'}
        )

    def test_admin_api_view_with_invalid_token_returns_unauthorized(self):
        response = self.client.get(
            reverse('admin-message'), HTTP_AUTHORIZATION="Bearer invalid-token"
        )

        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'message': "Given token not valid for any token type"}
        )

    @patch.object(TokenBackend, 'decode')
    def test_admin_api_view_with_valid_token_returns_ok(self, mock_decode):
        mock_decode.return_value = VALID_TOKEN_PAYLOAD

        response = self.client.get(
            reverse('admin-message'), HTTP_AUTHORIZATION="Bearer valid-token"
        )

        self.assertEqual(response.status_code, 200)
        d = response.json()
        self.assertDictEqual({'text': d.get('text')}, {'text': AdminMessageApiView.text})