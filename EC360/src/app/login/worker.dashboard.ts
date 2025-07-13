import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="worker-dashboard">
      <h1>👷 Worker Dashboard</h1>
      <p class="welcome">Welcome back! Use the options below:</p>

      <nav class="nav">
        <a routerLink="/check-in" class="nav-link">🕒 Time Tracker</a>
        <a routerLink="/my-logs" class="nav-link">📋 My Logs</a>
      </nav>

      <button class="logout-btn" (click)="logout()">🔓 Logout</button>
    </div>
  `,
  styles: [`
    .worker-dashboard {
      max-width: 600px;
      margin: 3rem auto;
      background-color: #1e1e2f;
      color: #f1f1f1;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      text-align: center;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #90ee90;
    }

    .welcome {
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .nav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .nav-link {
      text-decoration: none;
      background: #28a745;
      padding: 0.7rem 1.2rem;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      transition: background 0.3s ease;
    }

    .nav-link:hover {
      background: #218838;
    }

    .logout-btn {
      margin-top: 2rem;
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    @media (max-width: 480px) {
      .worker-dashboard {
        padding: 1.5rem;
      }

      .nav {
        flex-direction: column;
      }

      .nav-link {
        width: 100%;
      }
    }
  `]
})
export class WorkerDashboard {
  constructor(private auth: Auth, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

