from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    


class Habit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20)  # daily / weekly
    target_per_day = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)





class Goal(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    target_value = models.IntegerField()
    deadline = models.DateField()
    is_achieved = models.BooleanField(default=False)




class Progress(models.Model):
    habit = models.OneToOneField(Habit, on_delete=models.CASCADE)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0)




from django.utils import timezone
class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    value = models.IntegerField(default=1)
    is_completed = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('habit', 'date')

