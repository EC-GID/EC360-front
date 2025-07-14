import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {

    if (this.auth.isLoggedIn()) {
      const role = this.auth.getUserRole();
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/check-in']);
      }
    }

    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['worker']
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.http.post<any>('http://ec360-production.up.railway.app/register', this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed';
        this.successMessage = '';
      }
    });
  }

   goToRegister(): void {
    this.router.navigate(['/login']);
  }
}
