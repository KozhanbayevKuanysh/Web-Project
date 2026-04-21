import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  todayHabits: any[] = [];
  summary: any = null;
  isLoading: boolean = false;
  isCompletingAll: boolean = false;
  completeAllMessage: string = '';
  errorMessage: string = '';

  constructor(
  private apiService: ApiService,
  private cd: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadToday();
    this.loadSummary();
  }

  loadToday(): void {
    this.isLoading = true;
    this.apiService.getTodayHabits().subscribe({
      next: (data) => {
        this.todayHabits = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load today\'s habits.';
        this.isLoading = false;
      }
    });
  }

  loadSummary(): void {
    this.apiService.getHabitSummary().subscribe({
      next: (data) => { this.summary = data, this.cd.detectChanges();}, 
      error: () => {}
    });
  }

  completeHabit(habit: any): void {
    if (habit.completed) return;
    this.apiService.completeHabit(habit.id).subscribe({
      next: () => {
        habit.completed = true;
        if (this.summary) {
          this.summary.completed_today++;
          this.summary.completion_rate = Math.round(
            (this.summary.completed_today / this.summary.total_habits) * 100
          );
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to complete habit.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  completeAll(): void {
    this.isCompletingAll = true;
    this.apiService.completeAllToday().subscribe({
      next: (res) => {
        this.todayHabits.forEach(h => h.completed = true);
        if (this.summary) {
          this.summary.completed_today = this.summary.total_habits;
          this.summary.completion_rate = 100;
        }
        this.completeAllMessage = res.message;
        this.isCompletingAll = false;
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

  get completedCount(): number {
    return this.todayHabits.filter(h => h.completed).length;
  }

  get totalCount(): number {
    return this.todayHabits.length;
  }

  get progressPercent(): number {
    if (this.totalCount === 0) return 0;
    return Math.round((this.completedCount / this.totalCount) * 100);
  }

  get allDone(): boolean {
    return this.totalCount > 0 && this.completedCount === this.totalCount;
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  get todayDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  // SVG ring math
  get ringCircumference(): number { return 2 * Math.PI * 36; }
  get ringOffset(): number {
    return this.ringCircumference - (this.progressPercent / 100) * this.ringCircumference;
  }
}