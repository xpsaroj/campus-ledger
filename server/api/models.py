from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
	user = models.OneToOneField(
		User,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='student_profile',
	)
	name = models.CharField(max_length=120)
	email = models.EmailField(unique=True)
	department = models.CharField(max_length=120)
	year = models.PositiveSmallIntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['name']

	def __str__(self):
		return f'{self.name} ({self.department})'


class Enrollment(models.Model):
	SEMESTER_CHOICES = [
		('Spring', 'Spring'),
		('Summer', 'Summer'),
		('Fall', 'Fall'),
	]
	GRADE_CHOICES = [
		('A', 'A'),
		('B', 'B'),
		('C', 'C'),
		('D', 'D'),
		('F', 'F'),
	]

	student = models.ForeignKey(
		Student,
		on_delete=models.CASCADE,
		related_name='enrollments',
	)
	course_name = models.CharField(max_length=150)
	semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)
	grade = models.CharField(max_length=2, choices=GRADE_CHOICES)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.student.name} - {self.course_name}'
