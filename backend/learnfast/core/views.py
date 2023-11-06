""" from rest_framework import viewsets, permissions
from rest_framework.views import exception_handler
from .models import Note
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure the user is logged in

    def get_queryset(self):
        # This will only return notes that belong to the current user
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # This will associate the note with the user that created it
        serializer.save(user=self.request.user)

def api_exception_handler(exc, context=None):
    response = exception_handler(exc, context=context)
    if response and isinstance(response.data, dict):
        response.data = {'message': response.data.get('detail', 'API Error')}
    else:
        response.data = {'message': 'API Error'}
    return response
 """

from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import exception_handler

from messages_api.models import Message
from messages_api.serializers import MessageSerializer


class MessageApiView(RetrieveAPIView):
    serializer_class = MessageSerializer
    text = None

    def get_object(self):
        return Message(text=self.text)


class PublicMessageApiView(MessageApiView):
    text = "This is a public message."


class ProtectedMessageApiView(MessageApiView):
    text = "This is a protected message."
    permission_classes = [IsAuthenticated]


class AdminMessageApiView(MessageApiView):
    text = "This is an admin message."
    permission_classes = [IsAuthenticated]


def api_exception_handler(exc, context=None):
    response = exception_handler(exc, context=context)
    if response and isinstance(response.data, dict):
        response.data = {'message': response.data.get('detail', 'API Error')}
    else:
        response.data = {'message': 'API Error'}
    return response