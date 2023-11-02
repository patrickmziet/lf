from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer

class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        # Ensure the note is associated with the current user
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)