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

  weekStart = '';
  weekEnd = '';

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchStatus();
    this.fetchLogs();

    this.timerSubscription = interval(60000).subscribe(() => {
      if (this.status.checkedIn && !this.status.checkedOut) {
        this.updateDurationLive();
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });
  }

  fetchStatus(): void {
    this.http.get<any>('https://ec360-production.up.railway.app/check-status', {
      headers: this.getAuthHeaders()
    }).subscribe({
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

  fetchLogs(): void {
    this.http.get<any[]>('https://ec360-production.up.railway.app/my-time-logs', {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        this.logs = data.sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());
        this.weekStart = '';
        this.weekEnd = '';
        this.updateDurationLive();
      },
      error: () => {
        this.logs = [];
      }
    });
  }

  updateDurationLive(): void {
    if (this.logs.length > 0) {
      const latestLog = this.logs[0];
      const checkInTime = new Date(latestLog.check_in);
      const checkOutTime = latestLog.check_out ? new Date(latestLog.check_out) : null;
      const now = new Date();

      const endTime = checkOutTime || now;

      const checkInUTC = Date.UTC(
        checkInTime.getUTCFullYear(),
        checkInTime.getUTCMonth(),
        checkInTime.getUTCDate(),
        checkInTime.getUTCHours(),
        checkInTime.getUTCMinutes(),
        checkInTime.getUTCSeconds()
      );

      const endTimeUTC = Date.UTC(
        endTime.getUTCFullYear(),
        endTime.getUTCMonth(),
        endTime.getUTCDate(),
        endTime.getUTCHours(),
        endTime.getUTCMinutes(),
        endTime.getUTCSeconds()
      );

      this.currentDuration = Math.floor((endTimeUTC - checkInUTC) / 60000);
    } else {
      this.currentDuration = 0;
    }
  }

  checkIn(): void {
    this.loading = true;
    this.http.post<any>('https://ec360-production.up.railway.app/check-in', {}, {
      headers: this.getAuthHeaders()
    }).subscribe({
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
    this.http.post<any>('https://ec360-production.up.railway.app/check-out', {}, {
      headers: this.getAuthHeaders()
    }).subscribe({
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

  goBack() {
    this.router.navigate(['/worker-dashboard']);
  }
}
