import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  summary: any = null;
  statsData: any[] = [];
  habits: any[] = [];
  habitLogs: any[] = [];

  groupBy: string = 'day';
  selectedHabit: string = '';
  startDate: string = '';
  endDate: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private barChart: any = null;
  private donutChart: any = null;
  private lineChart: any = null;

constructor(
  private apiService: ApiService,
  private cd: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadHabits();
  }

  ngAfterViewInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.donutChart?.destroy();
    this.lineChart?.destroy();
  }

  setGroupBy(g: string): void {
    this.groupBy = g;
    this.loadStats();
  }

  loadSummary(): void {
    this.apiService.getHabitSummary().subscribe({
      next: (data) => this.summary = data,
      error: () => this.errorMessage = 'Failed to load summary.'
    });
  }

  loadHabits(): void {
    this.apiService.getHabits().subscribe({
      next: (data) => { this.habits = data, this.cd.detectChanges(); },
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
        this.cd.detectChanges();
        setTimeout(() => {
          this.renderBarChart();
          this.renderDonutChart();
          this.renderLineChart();
        }, 100);
      },
      error: () => {
        this.errorMessage = 'Failed to load statistics.';
        this.isLoading = false;
      }
    });
  }

  private renderBarChart(): void {
    const canvas = document.getElementById('completionsChart') as HTMLCanvasElement;
    if (!canvas) return;
    this.barChart?.destroy();

    const labels = this.statsData.map(d => {
      const date = new Date(d.period);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = this.statsData.map(d => d.total);

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Completions',
          data,
          backgroundColor: '#0f172a',
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8', autoSkip: false, maxRotation: 45 },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 1 },
            border: { display: false },
            beginAtZero: true
          }
        }
      }
    });
  }

  private renderDonutChart(): void {
    const canvas = document.getElementById('habitChart') as HTMLCanvasElement;
    if (!canvas || this.habits.length === 0) return;
    this.donutChart?.destroy();

    // Count completions per habit from statsData (simplified: just use habit names)
    const colors = ['#0f172a', '#f59e0b', '#378add', '#1d9e75', '#e85d4a', '#7f77dd'];
    const labels = this.habits.map(h => h.name);
    // Mock completion counts per habit — replace with real data if you add per-habit endpoint
    const data = this.habits.map((_, i) => Math.max(1, this.statsData.length - i));

    this.donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 11 }, padding: 10, color: '#64748b', boxWidth: 10 }
          }
        }
      }
    });
  }

  private renderLineChart(): void {
    const canvas = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!canvas) return;
    this.lineChart?.destroy();

    // Group statsData by week for trend view
    const labels = this.statsData.slice(-8).map(d => {
      const date = new Date(d.period);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = this.statsData.slice(-8).map(d => d.total);

    this.lineChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No data'],
        datasets: [{
          label: 'Completions',
          data: data.length ? data : [0],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.08)',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8', autoSkip: true, maxRotation: 45 },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 12 }, color: '#94a3b8' },
            border: { display: false },
            beginAtZero: true
          }
        }
      }
    });
  }
}