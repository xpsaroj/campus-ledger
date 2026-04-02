from django.contrib import admin

from .models import Enrollment, Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = ['name', 'email', 'department', 'year', 'user']
	search_fields = ['name', 'email', 'department']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
	list_display = ['student', 'course_name', 'semester', 'grade']
	search_fields = ['student__name', 'course_name']
	list_filter = ['semester', 'grade']
