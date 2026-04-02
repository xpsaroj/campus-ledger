from rest_framework import serializers

from .models import Enrollment, Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id',
            'name',
            'email',
            'department',
            'year',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_year(self, value):
        if value < 1 or value > 8:
            raise serializers.ValidationError('Year must be between 1 and 8.')
        return value


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'student',
            'student_name',
            'course_name',
            'semester',
            'grade',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'student_name', 'created_at', 'updated_at']
