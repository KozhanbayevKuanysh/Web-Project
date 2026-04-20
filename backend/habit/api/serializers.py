from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        # Метод create_user автоматически хеширует пароль
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']




class HabitSerializer(serializers.ModelSerializer):
    goal = serializers.IntegerField(write_only=True, required=False)  # Accept 'goal' from frontend

    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        goal = validated_data.pop('goal', None)
        if goal is not None:
            validated_data['target_per_day'] = goal
        return super().create(validated_data)




class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = '__all__'



class StatisticsSerializer(serializers.Serializer):
    period = serializers.CharField()
    total = serializers.IntegerField()



class ProgressSerializer(serializers.Serializer):
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    total_completed = serializers.IntegerField()