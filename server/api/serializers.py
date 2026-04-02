from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Enrollment, Student


class StudentSerializer(serializers.ModelSerializer):
    account_username = serializers.CharField(write_only=True, required=False, allow_blank=True)
    account_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id',
            'name',
            'email',
            'department',
            'year',
            'account_username',
            'account_password',
            'user_username',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_year(self, value):
        if value < 1 or value > 4:
            raise serializers.ValidationError('Year must be between 1 and 4.')
        return value

    def validate(self, attrs):
        username = attrs.get('account_username', '').strip()
        password = attrs.get('account_password', '').strip()

        if self.instance is None:
            if not username:
                raise serializers.ValidationError({'account_username': 'Username is required for student login.'})
            if not password:
                raise serializers.ValidationError({'account_password': 'Password is required for student login.'})

        if username and not password:
            raise serializers.ValidationError({'account_password': 'Password is required when username is provided.'})
        if password and not username:
            raise serializers.ValidationError({'account_username': 'Username is required when password is provided.'})
        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'account_username': 'This username is already taken.'})

        return attrs

    def create(self, validated_data):
        username = validated_data.pop('account_username', '').strip()
        password = validated_data.pop('account_password', '').strip()

        user = None
        if username and password:
            user = User.objects.create_user(
                username=username,
                password=password,
                email=validated_data.get('email', ''),
                first_name=validated_data.get('name', ''),
            )

        return Student.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('account_username', None)
        validated_data.pop('account_password', None)
        return super().update(instance, validated_data)


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
