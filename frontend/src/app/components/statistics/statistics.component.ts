import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  summary: any = null;
  statsData: any[] = [];
  habits: any[] = [];

  groupBy: string = 'day';
  selectedHabit: string = '';
  startDate: string = '';
  endDate: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadStats();
    this.loadHabits();
  }

  loadSummary(): void {
    this.apiService.getHabitSummary().subscribe({
      next: (data) => this.summary = data,
      error: () => this.errorMessage = 'Failed to load summary.'
    });
  }

  loadHabits(): void {
    this.apiService.getHabits().subscribe({
      next: (data) => this.habits = data,
      error: () => {}
    });
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: any = { group_by: this.groupBy };
    if (this.startDate) filters.start = this.startDate;
    if (this.endDate) filters.end = this.endDate;
    if (this.selectedHabit) filters.habit = this.selectedHabit;

    this.apiService.getStatistics(filters).subscribe({
      next: (data: any) => {
        this.statsData = data.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load statistics.';
        this.isLoading = false;
      }
    });
  }

  getBarWidth(total: number): string {
    const max = Math.max(...this.statsData.map((d: any) => d.total), 1);
    return (total / max * 100) + '%';
  }

  formatPeriod(period: string): string {
    if (!period) return '';
    return new Date(period).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  }
}