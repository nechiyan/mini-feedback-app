from rest_framework import generics
from feedback.models import Feedback
from .serializers import FeedbackSerializer

class FeedbackListCreateAPIView(generics.ListCreateAPIView):
    queryset = Feedback.objects.order_by('-created_at')
    serializer_class = FeedbackSerializer

class FeedbackDeleteAPIView(generics.RetrieveDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    lookup_field = "id"
