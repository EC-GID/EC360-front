import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './approval.html',
  styleUrls: ['./approval.css']
})
export class Approval implements OnInit {
  pendingUsers: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient, private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    this.http.get<any[]>('https://ec360-production.up.railway.app/pending-users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.pendingUsers = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load pending users';
        this.loading = false;
      }
    });
  }

  approveUser(id: number): void {
    const token = this.auth.getToken();
    this.http.patch(`https://ec360-production.up.railway.app/approve-user/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(user => user.id !== id);
      },
      error: (err) => {
        alert(err.error?.error || 'Approval failed');
      }
    });
  }

  rejectUser(id: number): void {
  const token = this.auth.getToken();
  this.http.delete(`https://ec360-production.up.railway.app/admin/reject-user/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      this.pendingUsers = this.pendingUsers.filter(user => user.id !== id);
    },
    error: (err) => {
      alert(err.error?.error || 'Rejection failed');
    }
  });
}


  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
