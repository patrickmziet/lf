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

from .views import PublicMessageApiView, ProtectedMessageApiView, AdminMessageApiView, NoteListCreateAPIView


urlpatterns = [
    path('public', PublicMessageApiView.as_view(), name='public-message'),
    path('protected', ProtectedMessageApiView.as_view(), name='protected-message'),
    path('admin', AdminMessageApiView.as_view(), name='admin-message'),
    path('notes/', NoteListCreateAPIView.as_view(), name='note-list-create'),
]