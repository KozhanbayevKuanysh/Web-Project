import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/home';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    if (this.apiService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.apiService.saveTokens(response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Is the backend running?';
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onLogout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}