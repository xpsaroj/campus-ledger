from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import EnrollmentViewSet, StudentViewSet, logout_view

router = DefaultRouter()
router.register('students', StudentViewSet, basename='student')
router.register('enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', obtain_auth_token, name='auth-token'),
    path('auth/logout/', logout_view, name='auth-logout'),
]
