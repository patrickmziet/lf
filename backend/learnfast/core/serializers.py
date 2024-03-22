from rest_framework import serializers
from .models import User, Topic, Document, Flashcard

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'sub', 'email', 'is_verified', 'given_name', 
                  'family_name', 'nickname', 'name', 'picture', 'locale']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title', 'created_at', 'updated_at']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'document', 'uploaded_at', 'topic']

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'topic', 'question', 'answer', 'start_end', 'easiness', 
                  'interval', 'repetitions', 'consecutive_correct',
                  'rapid_attempts', 'rapid_correct', 'record', 
                  'due_date', 'created_at', 'updated_at']
