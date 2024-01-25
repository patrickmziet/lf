from django.urls import path
from .views import (
    CreateUserIfNotExistView,
    TopicListCreateAPIView,
    TopicDocumentsAPIView,
    DocumentUploadView,
    TopicDestroyAPIView,
    TopicRetrieveAPIView,
    FlashcardListCreateAPIView,
    FlashcardUpdateAPIView,
    FlashcardMoreAPIView,
    FlashcardDestroyAPIView,
)
    
urlpatterns = [
    path('create-user-if-not-exist/', CreateUserIfNotExistView.as_view(), name='create-user-if-not-exist'),
    path('topics/', TopicListCreateAPIView.as_view(), name='topic-list-create'),
    path('topics/delete/<int:pk>/', TopicDestroyAPIView.as_view(), name='topic-destroy'),
    path('topics/<int:pk>/', TopicRetrieveAPIView.as_view(), name='topic-retrieve'),
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/<int:topic_id>/', TopicDocumentsAPIView.as_view(), name='topic-documents'),
    path('flashcards/<int:topic_id>/', FlashcardListCreateAPIView.as_view(), name='flashcards-list-create'),
    path('flashcards/update/', FlashcardUpdateAPIView.as_view(), name='flashcards-update'),
    path('flashcards/more/<int:topic_id>/', FlashcardMoreAPIView.as_view(), name='flashcards-more'),
    path('flashcards/delete/<int:pk>/', FlashcardDestroyAPIView.as_view(), name='flashcard-delete'),
]