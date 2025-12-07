from rest_framework.pagination import PageNumberPagination

class FeedbackPagination(PageNumberPagination):
    page_size = 3
    page_query_param = "page"
