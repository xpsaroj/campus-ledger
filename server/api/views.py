from rest_framework import permissions, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Enrollment, Student
from .serializers import EnrollmentSerializer, StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
	queryset = Student.objects.all()
	serializer_class = StudentSerializer
	permission_classes = [permissions.IsAuthenticated]
	search_fields = ['name', 'email', 'department']
	ordering_fields = ['name', 'department', 'year', 'created_at']


class EnrollmentViewSet(viewsets.ModelViewSet):
	queryset = Enrollment.objects.select_related('student').all()
	serializer_class = EnrollmentSerializer
	permission_classes = [permissions.IsAuthenticated]
	search_fields = ['course_name', 'student__name', 'semester', 'grade']
	ordering_fields = ['course_name', 'semester', 'grade', 'created_at']


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
	Token.objects.filter(user=request.user).delete()
	return Response({'detail': 'Logged out successfully.'})
