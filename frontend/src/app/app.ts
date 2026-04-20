import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Чтобы работал *ngIf
import { RouterOutlet, RouterLink, Router } from '@angular/router'; // Для навигации
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { 
  constructor(
    public apiService: ApiService, 
    private router: Router
  ) {}

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}