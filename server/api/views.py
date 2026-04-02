from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enrollment, Student
from .serializers import EnrollmentSerializer, StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
	queryset = Student.objects.select_related('user').all()
	serializer_class = StudentSerializer
	permission_classes = [permissions.IsAdminUser]
	search_fields = ['name', 'email', 'department']
	ordering_fields = ['name', 'department', 'year', 'created_at']


class EnrollmentViewSet(viewsets.ModelViewSet):
	queryset = Enrollment.objects.select_related('student').all()
	serializer_class = EnrollmentSerializer
	permission_classes = [permissions.IsAdminUser]
	search_fields = ['course_name', 'student__name', 'semester', 'grade']
	ordering_fields = ['course_name', 'semester', 'grade', 'created_at']


class DashboardSummaryView(APIView):
	permission_classes = [permissions.IsAdminUser]

	def get(self, request):
		students_qs = Student.objects.all()
		enrollments_qs = Enrollment.objects.select_related('student').all()

		recent_students = StudentSerializer(students_qs.order_by('-created_at')[:5], many=True).data
		recent_enrollments = EnrollmentSerializer(enrollments_qs.order_by('-created_at')[:5], many=True).data

		return Response(
			{
				'student_count': students_qs.count(),
				'enrollment_count': enrollments_qs.count(),
				'recent_students': recent_students,
				'recent_enrollments': recent_enrollments,
			}
		)


class MyProfileView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		user = request.user
		if user.is_staff:
			return Response(
				{
					'detail': 'My Profile is available only for student accounts.',
				},
				status=status.HTTP_403_FORBIDDEN,
			)

		student = getattr(user, 'student_profile', None)

		if not student:
			return Response(
				{
					'username': user.username,
					'is_student_account': False,
					'message': 'No student profile linked to this account.',
				},
				status=status.HTTP_200_OK,
			)

		enrollments = Enrollment.objects.filter(student=student).order_by('-created_at')
		return Response(
			{
				'username': user.username,
				'is_student_account': True,
				'student': StudentSerializer(student).data,
				'enrollments': EnrollmentSerializer(enrollments, many=True).data,
			}
		)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
	user = request.user
	return Response(
		{
			'username': user.username,
			'role': 'admin' if user.is_staff else 'student',
		}
	)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
	Token.objects.filter(user=request.user).delete()
	return Response({'detail': 'Logged out successfully.'})
