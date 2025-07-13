import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="dashboard">
      <header>
        <h1>👑 Admin Dashboard</h1>
        <p class="welcome">Welcome, Admin {{ adminId === 1 ? '(Super Admin)' : '' }}</p>
      </header>

      <section class="nav">
        <a routerLink="/department" routerLinkActive="active" aria-label="Manage Departments">🏢 Departments</a>
        <a routerLink="/employees" routerLinkActive="active" aria-label="Manage Employees">👨‍💼 Employees</a>
        <a routerLink="/admin-logs" routerLinkActive="active" aria-label="View Time Logs">📋 Time Logs</a>
        <a routerLink="/admin/weekly-payments" routerLinkActive="active" aria-label="Weekly Payments">🧾 Weekly Payments</a>


        <a *ngIf="adminId === 1" routerLink="/approve-users" routerLinkActive="active" aria-label="Approve Users">
          ✅ User Approval
        </a>
      </section>

      <footer>
        <button (click)="logout()" aria-label="Logout from Dashboard">🔒 Logout</button>
      </footer>
    </main>
  `,
  styles: [`
    .dashboard {
      max-width: 720px;
      margin: 3rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: 0.3rem;
      color: #222;
    }

    .welcome {
      font-size: 1rem;
      color: #555;
      margin-bottom: 2rem;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .nav a {
      display: inline-block;
      text-decoration: none;
      background: #007bff;
      color: #fff;
      padding: 0.7rem 1.4rem;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .nav a:hover {
      background: #0056b3;
    }

    .nav a.active {
      background: #0056b3;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    footer {
      margin-top: 2rem;
    }

    button {
      background-color: #dc3545;
      color: #fff;
      padding: 0.7rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #c82333;
    }

    @media (max-width: 600px) {
      .nav {
        flex-direction: column;
        gap: 0.8rem;
      }
    }
  `]
})
export class Dashboard {
  adminId: number | null = null;

  constructor(private auth: Auth, private router: Router) {
    this.adminId = this.auth.getUserId();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
