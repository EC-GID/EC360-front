import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';
  showResend = false;
  lastAttemptedEmail = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {
    if (this.auth.isLoggedIn()) {
      const role = this.auth.getUserRole();
      const userId = this.auth.getUserId();
      if (role === 'admin' && userId === 1) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/worker-dashboard']);
      }
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = '';
    this.showResend = false;
    this.lastAttemptedEmail = this.loginForm.value.email;

    this.http.post<any>('https://ec360-production.up.railway.app/login', this.loginForm.value).subscribe({
      next: (res) => {
        this.auth.setLoginSession(res.token, res.user.role, res.user.id);

        if (res.user.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/worker-dashboard']);
        }
      },
      error: (err: HttpErrorResponse) => {
        const errorText = err.error?.error || 'Login failed';
        this.errorMessage = errorText;

        if (errorText.includes('verify your email')) {
          this.showResend = true;
        }
      }
    });
  }

  resendVerification(email: string): void {
    this.http.post('https://ec360-production.up.railway.app/resend-verification', { email }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.showResend = false;
      },
      error: (err) => {
        alert(err.error?.error || 'Something went wrong');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

   goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}