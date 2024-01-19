""" from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
 """
from django.urls import path

from .views import (
    PublicMessageApiView, 
    ProtectedMessageApiView, 
    AdminMessageApiView, 
    NoteListCreateAPIView,
    CreateUserIfNotExistView,
    TopicListCreateAPIView,
    TopicDocumentsAPIView,
    DocumentUploadView,
    TopicDestroyAPIView,
    FlashcardListCreateAPIView,
    FlashcardUpdateAPIView,
    FlashcardMoreAPIView,
    FlashcardDestroyAPIView,
)
    

urlpatterns = [
    path('public', PublicMessageApiView.as_view(), name='public-message'),
    path('protected', ProtectedMessageApiView.as_view(), name='protected-message'),
    path('admin', AdminMessageApiView.as_view(), name='admin-message'),
    path('notes/', NoteListCreateAPIView.as_view(), name='note-list-create'),
    path('create-user-if-not-exist/', CreateUserIfNotExistView.as_view(), name='create-user-if-not-exist'),
    path('topics/', TopicListCreateAPIView.as_view(), name='topic-list-create'),
    path('topics/delete/<int:pk>/', TopicDestroyAPIView.as_view(), name='topic-destroy'),
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/<int:topic_id>/', TopicDocumentsAPIView.as_view(), name='topic-documents'),
    path('flashcards/<int:topic_id>/', FlashcardListCreateAPIView.as_view(), name='flashcards-list-create'),
    path('flashcards/update/', FlashcardUpdateAPIView.as_view(), name='flashcards-update'),
    path('flashcards/more/<int:topic_id>/', FlashcardMoreAPIView.as_view(), name='flashcards-more'),
    path('flashcards/delete/<int:pk>/', FlashcardDestroyAPIView.as_view(), name='flashcard-delete'),
]