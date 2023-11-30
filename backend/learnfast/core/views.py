from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import exception_handler

from core.models import Message
from core.serializers import MessageSerializer


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
    elif response is not None:
        response.data = {'message': 'API Error'}
    return response


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Note, User
from .serializers import NoteSerializer, UserSerializer
import logging

logging.basicConfig(filename='core.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.info('This is an info message')


class CreateUserIfNotExistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Try to get the user first
        try:
            user = User.objects.get(
                id=request.data.get('id'),
                sub=request.data.get('sub'),
                email=request.data.get('email')
            )
            return Response({"message": "User already exists"}, status=200)
        except User.DoesNotExist:
            # If the user does not exist, proceed with serializer validation and creation
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user, created = User.objects.get_or_create(
                    defaults=serializer.validated_data,
                    **{field: serializer.validated_data[field] for field in ['id', 'sub', 'email'] if field in serializer.validated_data}
                )
                status_code = 201 if created else 200
                return Response({"message": "User created" if created else "User exists"}, 
                                status=status_code)
            return Response({"Serializer errors": serializer.errors, 
                             "Valid serializer": False}, status=400)


class NoteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Note.objects.all() # perhaps very inefficient?
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        User = get_user_model()
        user = User.objects.get(id=self.request.user.id.split('|')[1])
        serializer.save(user=user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user.id.split('|')[1])

