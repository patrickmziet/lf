from django.urls import path
from . import api

urlpatterns = [
    path('notes/', api.NoteListCreate.as_view(), name='note-list-create'),
]
