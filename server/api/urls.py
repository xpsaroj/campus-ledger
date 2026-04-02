from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    DashboardSummaryView,
    EnrollmentViewSet,
    MyProfileView,
    StudentViewSet,
    logout_view,
    me_view,
)

router = DefaultRouter()
router.register('students', StudentViewSet, basename='student')
router.register('enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', obtain_auth_token, name='auth-token'),
    path('auth/me/', me_view, name='auth-me'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('profile/me/', MyProfileView.as_view(), name='profile-me'),
]
