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
  habits: any[] = [];
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
    this.loadAll();
    this.loadSummary();
  }

  loadAll(): void {
    this.isLoading = true;
    this.apiService.getHabits().subscribe({
      next: (data) => {
        this.habits = data;
        this.loadTodayHabits();
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load habits.';
        this.isLoading = false;
      }
    });
  }

  loadTodayHabits(): void {
  this.apiService.getTodayHabits().subscribe({
    next: (data: any[]) => {

      this.todayHabits = this.habits.map(habit => {
        const today = data.find(t => t.id == habit.id);
        return {
          ...habit,
          completed: today ? today.completed : false
        };
      });

      this.isLoading = false;
      this.cd.detectChanges();
    },
    error: () => { this.isLoading = false; }
  });
}

  loadSummary(): void {
    this.apiService.getHabitSummary().subscribe({
      next: (data) => { this.summary = data; },
      error: () => {}
    });
  }

  isTodayComplete(habit: any): boolean {
  const h = this.todayHabits.find(x => x.id == habit.id);
  return h ? h.completed === true : false;
}

  completeHabit(habit: any): void {
    if (this.isTodayComplete(habit)) return;
    this.apiService.completeHabit(habit.id).subscribe({
      next: () => {
        this.loadTodayHabits();
        this.loadSummary();
        this.cd.detectChanges();
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Already completed today!';
        } else {
          this.errorMessage = 'Failed to complete habit.';
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
        this.loadTodayHabits();
        this.loadSummary();
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

  get ringCircumference(): number { return 2 * Math.PI * 36; }
  get ringOffset(): number {
    return this.ringCircumference - (this.progressPercent / 100) * this.ringCircumference;
  }
}