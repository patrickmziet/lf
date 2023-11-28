from rest_framework import serializers
from .models import Note, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_verified', 'given_name', 
                  'family_name', 'nickname', 'name', 'picture', 'locale']

class MetadataSerializer(serializers.Serializer):
    api = serializers.CharField()
    branch = serializers.CharField()


class MessageSerializer(serializers.Serializer):
    text = serializers.CharField()
    metadata = MetadataSerializer()


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


""" from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
 """    
