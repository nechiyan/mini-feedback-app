from rest_framework import generics, filters
from feedback.models import Feedback
from .serializers import FeedbackSerializer
from .pagination import FeedbackPagination

class FeedbackListCreateAPIView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    pagination_class = FeedbackPagination
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['name', 'email', 'comment'] 
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

class FeedbackDeleteAPIView(generics.RetrieveDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    lookup_field = "id"
