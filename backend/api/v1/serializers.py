from rest_framework import serializers
from feedback.models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'name', 'email', 'comment', 'rating', 'created_at', 'phone_number']
        read_only_fields = ['id', 'created_at']

    def validate_comment(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Comment cannot be empty.")
        return value
