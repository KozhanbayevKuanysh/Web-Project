import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService, Habit } from '../../services/api.service';
import { ChangeDetectorRef } from '@angular/core';

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
  categories: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Create form
  showCreateForm: boolean = false;
  newHabit: Habit = { name: '', description: '', frequency: 'daily', goal: 1 };
  newCategoryName: string = '';
  showCategoryForm: boolean = false;

  // Complete All
  isCompletingAll: boolean = false;
  completeAllMessage: string = '';

  // Progress modal
  selectedHabit: any = null;
  habitProgress: any = null;
  isLoadingProgress: boolean = false;
  showProgressModal: boolean = false;

  constructor(
  private apiService: ApiService,
  private cd: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadHabits();
    this.loadTodayHabits();
    this.loadCategories();
  }

  // ── Load ──────────────────────────────────────

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => { this.categories = data, this.cd.detectChanges();},
      error: () => {}
    });
  }

  loadHabits(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getHabits().subscribe({
      next: (data) => { this.habits = data; this.isLoading = false; this.cd.detectChanges();},
      error: () => { this.errorMessage = 'Failed to load habits. Please try again.'; this.isLoading = false; }
    });
  }

  loadTodayHabits(): void {
    this.apiService.getTodayHabits().subscribe({
      next: (data) => { this.todayHabits = data, this.cd.detectChanges();},
      error: () => {}
    });
  }

  // ── Complete ──────────────────────────────────

  completeHabit(habit: Habit): void {
    if (!habit.id) return;
    this.apiService.completeHabit(habit.id).subscribe({
      next: () => {
        this.loadHabits();
        this.loadTodayHabits();
        this.cd.detectChanges();
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'This habit has already been completed today!';
        } else {
          this.errorMessage = 'Failed to complete habit. Please try again.';
        }
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  completeAll(): void {
    this.isCompletingAll = true;
    this.completeAllMessage = '';
    this.apiService.completeAllToday().subscribe({
      next: (res) => {
        this.completeAllMessage = res.message;
        this.isCompletingAll = false;
        this.loadHabits();
        this.loadTodayHabits();
        this.cd.detectChanges();
        setTimeout(() => this.completeAllMessage = '', 3000);
      },
      error: () => {
        this.isCompletingAll = false;
        this.errorMessage = 'Failed to complete all habits.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // ── Progress Modal ────────────────────────────

  openProgress(habit: Habit): void {
    this.selectedHabit = habit;
    this.showProgressModal = true;
    this.habitProgress = null;
    this.isLoadingProgress = true;

    this.apiService.getHabitProgress(habit.id!).subscribe({
      next: (data) => {
        this.habitProgress = data;
        this.isLoadingProgress = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoadingProgress = false;
        this.habitProgress = null;
      }
    });
  }

  closeProgress(): void {
    this.showProgressModal = false;
    this.selectedHabit = null;
    this.habitProgress = null;
  }

  getCompletionPercent(): number {
    if (!this.habitProgress) return 0;
    const max = Math.max(this.habitProgress.longest_streak, 1);
    return Math.round((this.habitProgress.current_streak / max) * 100);
  }

  // ── Create / Delete ───────────────────────────

  createHabit(): void {
    if (!this.newHabit.name || this.newHabit.name.trim() === '') {
      this.errorMessage = 'Please enter a habit name.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.apiService.createHabit(this.newHabit).subscribe({
      next: (res) => {
        this.habits.push(res);
        this.showCreateForm = false;
        this.cd.detectChanges();
        this.resetCreateForm();
      },
      error: () => {
        this.errorMessage = 'Failed to create habit.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  deleteHabit(habit: any): void {
    if (!confirm('Delete this habit?')) return;
    this.apiService.deleteHabit(habit.id).subscribe({
      next: () => { this.habits = this.habits.filter(h => h.id !== habit.id), this.cd.detectChanges();}
    });
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.apiService.createCategory({ name: this.newCategoryName }).subscribe({
      next: (cat) => {
        this.categories.push(cat);
        this.newCategoryName = '';
        this.showCategoryForm = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to create category.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) this.resetCreateForm();
  }

  resetCreateForm(): void {
    this.newHabit = { name: '', description: '', frequency: 'daily', goal: 1 };
    this.showCategoryForm = false;
    this.newCategoryName = '';
  }

  isTodayComplete(habit: Habit): boolean {
    return this.todayHabits.some(h => h.id === habit.id);
  }

  get allDoneToday(): boolean {
    return this.habits.length > 0 && this.habits.every(h => this.isTodayComplete(h));
  }
}