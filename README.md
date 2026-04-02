# Campus Ledger

Campus Ledger is a CRUD application built with Django REST Framework and React (Vite).
It includes token-based authentication and two related modules:

- Students
- Enrollments

## Project Structure

- server: Django REST Framework API
- client: React + Vite frontend

## Features

- Token authentication (login/logout)
- Role-based experience (Admin UI vs Student UI)
- Admin home dashboard with summary stats and recent activity
- Admin-only CRUD for Students
- Admin-only CRUD for Enrollments
- Student self-service My Profile page
- Student self-service My Enrollments page
- Required student login account creation from Students form
- Search support on both modules
- Responsive UI with plain CSS

## Tech Stack

### Backend

- Django
- Django REST Framework
- DRF Token Authentication
- django-cors-headers
- SQLite

### Frontend

- React
- Vite
- react-router-dom
- Axios
- Plain CSS

## Prerequisites

- Python 3.11+ (or compatible modern Python)
- Node.js 18+
- npm 9+

## Backend Setup

1. Open a terminal in the project root.
2. Move to the server folder.
3. Install Python dependencies.
4. Run migrations.
5. Start the backend server.

Commands:

```bash
cd server
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend API will be available at:

- http://127.0.0.1:8000/api/

### Default Login Account

A default user is created during this implementation:

- Username: admin
- Password: admin1234

If needed, create another user manually:

```bash
cd server
python manage.py createsuperuser
```

## Frontend Setup

1. Open a second terminal in the project root.
2. Move to the client folder.
3. Install dependencies.
4. Start the dev server.

Commands:

```bash
cd client
npm install
npm run dev
```

The frontend will run at:

- http://localhost:5173

## Environment Configuration

The frontend uses this API base URL by default:

- http://127.0.0.1:8000/api

To override it, create client/.env with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## API Endpoints

### Authentication

- POST /api/auth/token/ (login and get token)
- GET /api/auth/me/ (fetch current authenticated user role)
- POST /api/auth/logout/ (invalidate current token)

### Students

- Admin only
- GET /api/students/
- POST /api/students/
- GET /api/students/{id}/
- PUT /api/students/{id}/
- DELETE /api/students/{id}/

### Enrollments

- Admin only
- GET /api/enrollments/
- POST /api/enrollments/
- GET /api/enrollments/{id}/
- PUT /api/enrollments/{id}/
- DELETE /api/enrollments/{id}/

### Dashboard and Profile

- GET /api/dashboard/summary/ (admin only)
- GET /api/profile/me/ (student only)

## Data Model

### Student

- name
- email (unique)
- department
- year (1-4)
- required linked user account for student login
- created_at
- updated_at

### Enrollment

- student (foreign key to Student)
- course_name
- semester (Spring, Summer, Fall)
- grade (A, B, C, D, F)
- created_at
- updated_at

## Usage Notes

- You must log in before accessing protected pages.
- Admin users land on Home and can manage Students and Enrollments.
- Student users land on My Profile and can access only My Profile and My Enrollments.
- Student users do not see the admin dashboard or management pages.
- While creating a student, admin must provide student username and password.
- Deleting a student also deletes related enrollments.

## Development Commands

Backend checks:

```bash
cd server
python manage.py check
```

Frontend production build:

```bash
cd client
npm run build
```
