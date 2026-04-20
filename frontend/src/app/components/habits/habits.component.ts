// frontend/src/app/components/habits/habits.component.ts
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService, Habit } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.css'
})

export class HabitsComponent implements OnInit {
  habits: Habit[] = [];
  todayHabits: Habit[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // For creating new habit
  showCreateForm: boolean = false;
  newHabit: Habit = {
    name: '',
    description: '',
    frequency: 'daily',
    goal: 1,
    category: 1
  };

  constructor(private apiService: ApiService) {}

  categories: any[] = [];

  ngOnInit(): void {
    this.loadHabits();
    this.loadTodayHabits();
    this.loadCategories();
  }

  loadCategories(): void {
  this.apiService.getCategories().subscribe({
    next: (data) => this.categories = data,
    error: (err) => console.error('Could not load categories', err)
  });
}

  loadHabits(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getHabits().subscribe({
      next: (data) => {
        this.habits = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading habits:', error);
        this.errorMessage = 'Failed to load habits. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadTodayHabits(): void {
    this.apiService.getTodayHabits().subscribe({
      next: (data) => {
        this.todayHabits = data;
      },
      error: (error) => {
        console.error('Error loading today habits:', error);
      }
    });
  }

  completeHabit(habit: Habit): void {
    if (!habit.id) return;

    this.apiService.completeHabit(habit.id).subscribe({
      next: () => {
        console.log('Habit completed!');
        this.loadHabits(); // Reload to update streak
        this.loadTodayHabits();
      },
      error: (error) => {
        console.error('Error completing habit:', error);
        if (error.status === 400) {
          alert('This habit has already been completed today!');
        } else {
          alert('Failed to complete habit. Please try again.');
        }
      }
    });
  }

// Создание
createHabit(): void {
  if (!this.newHabit.name || this.newHabit.name.trim() === '') {
    alert('Please enter a habit name');
    return;
  }

  this.apiService.createHabit(this.newHabit).subscribe({
    next: (res) => {
      this.habits.push(res); // Добавляем в список сразу
      this.showCreateForm = false;
      this.newHabit = { name: '', frequency: 'daily', goal: 1 }; // Сброс
    },
    error: () => alert('Ошибка при создании')
  });
}

// Удаление
deleteHabit(habit: any): void {
  if (!confirm('Удалить?')) return;
  this.apiService.deleteHabit(habit.id).subscribe({
    next: () => {
      this.habits = this.habits.filter(h => h.id !== habit.id); // Удаляем из списка
    }
  });
}

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetCreateForm();
    }
  }

  resetCreateForm(): void {
    this.newHabit = {
      name: '',
      description: '',
      frequency: 'daily',
      goal: 1,
      category: 1
    };
  }

  isTodayComplete(habit: Habit): boolean {
    return this.todayHabits.some(h => h.id === habit.id);
  }



newCategoryName: string = '';
showCategoryForm: boolean = false;

createCategory(): void {
  if (!this.newCategoryName.trim()) {
    alert('Enter category name');
    return;
  }
  this.apiService.createCategory({ name: this.newCategoryName }).subscribe({
    next: (cat) => {
      this.categories.push(cat);
      this.newCategoryName = '';
      this.showCategoryForm = false;
    },
    error: () => alert('Failed to create category')
  });
}
}