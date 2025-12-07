from django.urls import path
from .views import FeedbackListCreateAPIView, FeedbackDeleteAPIView

urlpatterns = [
    path('feedback/', FeedbackListCreateAPIView.as_view(), name='feedback-list-create'),
    path("feedback/<int:id>/", FeedbackDeleteAPIView.as_view(), name="feedback-delete"),
]
