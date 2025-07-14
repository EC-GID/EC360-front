import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  email = '';
  success = '';
  error = '';

  constructor(private http: HttpClient,  private router: Router,) {}

  sendResetLink() {
    this.success = '';
    this.error = '';

    this.http.post('http://ec360-production.up.railway.app/forgot-password', { email: this.email }).subscribe({
      next: () => this.success = 'Reset link sent!',
      error: err => this.error = err.error.error || 'Failed to send reset link.'
    });
  }
}

