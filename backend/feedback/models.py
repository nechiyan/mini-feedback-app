from django.db import models

class Feedback(models.Model):
    name = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # optional
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name or 'Anonymous'} - {self.created_at.isoformat()}"
