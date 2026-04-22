from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('habits', HabitViewSet)
router.register('habitlogs', HabitLogViewSet)

urlpatterns = [
    # FBV
    path('habits/summary/', habit_summary, name='habit_summary'),
    path('habits/complete-all/', complete_all_today, name='complete_all_today'),
    
    path('statistics/', StatisticsView.as_view()),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls