from django.contrib import admin
from .models import Category, Habit, HabitLog

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'category') 
    list_filter = ('category', 'user')
    search_fields = ('name',)

@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):

    list_display = ('id', 'habit')