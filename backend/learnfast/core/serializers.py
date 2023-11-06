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

from rest_framework import serializers


class MetadataSerializer(serializers.Serializer):
    api = serializers.CharField()
    branch = serializers.CharField()


class MessageSerializer(serializers.Serializer):
    text = serializers.CharField()
    metadata = MetadataSerializer()