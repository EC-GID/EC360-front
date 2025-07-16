import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-time-tracker',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './time-tracker.html',
  styleUrls: ['./time-tracker.css']
})
export class TimeTrackerComponent implements OnInit, OnDestroy {

  message = '';
  loading = false;
  logs: any[] = [];
  currentDuration = 0;
  timerSubscription!: Subscription;

  status = {
    checkedIn: false,
    checkedOut: false
  };

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchStatus();
    this.fetchLogs();

    this.timerSubscription = interval(60000).subscribe(() => {
      if (this.status.checkedIn && !this.status.checkedOut) {
        this.updateDurationLive();
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  checkIn(): void {
    this.loading = true;
    this.http.post<any>(
      'https://ec360-production.up.railway.app/check-in',
      {},
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: (res) => {
        this.message = res.message;
        this.status.checkedIn = true;
        this.status.checkedOut = false;
        this.loading = false;
        this.fetchLogs();
      },
      error: (err) => {
        this.message = err.error?.error || 'Check-in failed';
        this.loading = false;
      }
    });
  }

  checkOut(): void {
    this.loading = true;
    this.http.post<any>(
      'https://ec360-production.up.railway.app/check-out',
      {},
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: (res) => {
        this.message = res.message;
        this.status.checkedOut = true;
        this.loading = false;
        this.fetchLogs();
      },
      error: (err) => {
        this.message = err.error?.error || 'Check-out failed';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/worker-dashboard']);
  }

  private fetchStatus(): void {
    this.http.get<any>(
      'https://ec360-production.up.railway.app/check-status',
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: (data) => {
        this.status.checkedIn = data.checkedIn;
        this.status.checkedOut = data.checkedOut;
      },
      error: () => {
        this.status.checkedIn = false;
        this.status.checkedOut = false;
      }
    });
  }

  private fetchLogs(): void {
    this.http.get<any[]>(
      'https://ec360-production.up.railway.app/my-time-logs',
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: (data) => {
        this.logs = data.sort(
          (a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
        );
        this.updateDurationLive();
      },
      error: () => {
        this.logs = [];
      }
    });
  }

  private updateDurationLive(): void {
    if (!this.logs.length || !this.logs[0].check_in) {
      this.currentDuration = 0;
      return;
    }

    const latestLog = this.logs[0];
    const checkInTime = new Date(latestLog.check_in + 'Z');

    if (isNaN(checkInTime.getTime())) {
      this.currentDuration = 0;
      return;
    }

    const checkOutTime = latestLog.check_out
      ? new Date(latestLog.check_out + 'Z')
      : new Date();

    const durationMs = checkOutTime.getTime() - checkInTime.getTime();

    this.currentDuration = isNaN(durationMs)
      ? 0
      : Math.floor(durationMs / 60000);
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });
  }
}
