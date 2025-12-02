from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at')
    list_display_links = ('id', 'name')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'comment')
