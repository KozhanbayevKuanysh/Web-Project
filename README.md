# web-group-project
## Description
Habit Tracker is a web application that helps users build and maintain daily habits. Users can create habits, track their progress, and stay consistent over time. The project is built using Angular for the frontend and Django REST Framework for the backend.
## Group Members
- Zhapbar Assylzhan
- Kozhanbayev Kuanysh
- Supugaliyeva Dilyara

# Habit Tracker API

## Features
- JWT Authentication
- CRUD for habits and categories
- Habit completion tracking
- Streak calculation
- Progress tracking
- Statistics with filters

## Endpoints

### Auth
POST /api/token/

### Habits
- GET /api/habits/
- POST /api/habits/
- POST /api/habits/{id}/complete/
- GET /api/habits/{id}/progress/
- GET /api/habits/today/

### Statistics
GET /api/statistics/

## Tech Stack
- Django
- Django REST Framework
- JWT Authentication

- ## Setup

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

## Frontend
- Angular
- HttpClient
- Routing
- JWT auth

## Backend
- Django REST Framework
- ViewSets, APIView, FBV
- PostgreSQL / SQLite