import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {
  email = '';
  newPassword = '';
  confirmPassword = '';
  success = '';
  error = '';

  constructor(private http: HttpClient) {}

  resetPassword() {
    this.success = '';
    this.error = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords don't match.";
      return;
    }

    this.http.post('https://ec360-production.up.railway.app/reset-password', {
      email: this.email,
      newPassword: this.newPassword
    }).subscribe({
      next: () => this.success = 'Password reset successful!',
      error: err => this.error = err.error.error || 'Failed to reset password.'
    });
  }
}
