import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HabitsComponent } from './components/habits/habits.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'habits', component: HabitsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '/home' }
];