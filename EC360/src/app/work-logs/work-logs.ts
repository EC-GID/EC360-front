import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';

interface LogEntry {
  check_in: string;
  check_out: string | null;
  duration_minutes: number;
}

@Component({
  selector: 'app-work-logs',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './work-logs.html',
  styleUrls: ['./work-logs.css']
})
export class WorkLogs implements OnInit {
  logs: LogEntry[] = [];
  errorMessage = '';

  constructor(private http: HttpClient, private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });

    this.http.get<LogEntry[]>('http://ec360-production.up.railway.app/my-time-logs', { headers }).subscribe({
      next: (data) => this.logs = data,
      error: (err) => {
        this.errorMessage = err?.error?.error || '❌ Failed to load your logs.';
      }
    });
  }

  goWorkerdashboard(): void {
    this.router.navigate(['/worker-dashboard']);
  }
}
