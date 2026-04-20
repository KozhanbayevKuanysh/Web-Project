import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HabitsComponent } from './components/habits/habits.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HabitsComponent }, // Страница с привычками на сегодня
  { path: 'habits', component: HabitsComponent }, // Можно использовать тот же компонент или создать новый для управления
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '/home' } // Редирект для несуществующих страниц
];