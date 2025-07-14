import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmailComponent implements OnInit {
  message = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.http.get(`https://ec360-production.up.railway.app/verify-email?token=${token}`)
        .subscribe({
          next: (res: any) => {
            this.message = res.message;
            this.loading = false;
            setTimeout(() => this.router.navigate(['/login']), 5000);
          },
          error: (err) => {
            this.message = err.error?.error || 'Verification failed';
            this.loading = false;
          }
        });
    } else {
      this.message = 'No token provided';
      this.loading = false;
    }
  }
}
