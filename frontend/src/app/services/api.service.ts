// frontend/src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Интерфейсы оставляем без изменений
export interface LoginCredentials { username: string; password: string; }
export interface TokenResponse { access: string; refresh: string; }
export interface Habit {
  id?: number;
  name: string;
  description?: string;
  category?: number;
  frequency?: string;
  goal?: number;
  created_at?: string;
  streak?: number;
}
export interface HabitCompletion { id?: number; habit: number; completed_date: string; }
export interface Statistics {
  total_habits: number;
  completed_today: number;
  total_completions: number;
  completion_rate: number;
  longest_streak: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // ============================================
  // Authentication
  // ============================================

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, credentials);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  saveTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // ============================================
  // Habits CRUD (Headers теперь добавляет Interceptor)
  // ============================================

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/habits/`);
  }

  getHabit(id: number): Observable<Habit> {
    return this.http.get<Habit>(`${this.apiUrl}/habits/${id}/`);
  }

  getHabitSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits/summary/`);
  }

  completeAllToday(): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits/complete-all/`, {});
  }
  createHabit(habit: Habit): Observable<Habit> {
    return this.http.post<Habit>(`${this.apiUrl}/habits/`, habit);
  }

  updateHabit(id: number, habit: Partial<Habit>): Observable<Habit> {
    return this.http.patch<Habit>(`${this.apiUrl}/habits/${id}/`, habit);
  }

  deleteHabit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/habits/${id}/`);
  }

  // ============================================
  // Habit Completion
  // ============================================

  completeHabit(id: number): Observable<HabitCompletion> {
    return this.http.post<HabitCompletion>(`${this.apiUrl}/habits/${id}/complete/`, {});
  }

  getHabitProgress(id: number, startDate?: string, endDate?: string): Observable<any> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get(`${this.apiUrl}/habits/${id}/progress/`, { params });
  }

  getTodayHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/habits/today/`);
  }

  // ============================================
  // Statistics
  // ============================================

  getStatistics(filters?: { start_date?: string; end_date?: string; category?: number }): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/statistics/`, { params: filters as any });
  }

  // ============================================
  // Categories
  // ============================================

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories/`, category);
  }
}