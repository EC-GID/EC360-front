import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-weekly-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-weekly-payments.html',
  styleUrls: ['./admin-weekly-payments.css']
})
export class AdminWeeklyPayments implements OnInit {
  payments: any[] = [];
  filteredPayments: any[] = [];

  weekStart = '';
  weekEnd = '';
  loading = false;
  error = '';
  selectedUser = '';
  customStart = '';
  customEnd = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchWeeklyPayments();
  }

  fetchWeeklyPayments(startDate?: string, endDate?: string): void {
    this.loading = true;
    let url = 'https://ec360-production.up.railway.app/admin/weekly-payments';

    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.payments = data;
        this.filteredPayments = data;
        this.weekStart = '';  // Set manually if needed
        this.weekEnd = '';    // Set manually if needed
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch data';
        this.loading = false;
      }
    });
  }

  getFormattedDate(date: string | null): string {
    if (!date) return '-';
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? '-' : parsed.toLocaleString();
  }

  filterByUser(): void {
    if (!this.selectedUser) {
      this.filteredPayments = [...this.payments];
    } else {
      this.filteredPayments = this.payments.filter(p =>
        p.full_name.toLowerCase().includes(this.selectedUser.toLowerCase())
      );
    }
  }

  applyDateFilter(): void {
    if (this.customStart && this.customEnd) {
      this.fetchWeeklyPayments(this.customStart, this.customEnd);
    }
  }

  exportToExcel(): void {
    const table = document.getElementById('payment-table');
    if (!table) return;

    const rows = Array.from(table.querySelectorAll('tr'));
    const csv = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th,td'));
      return cells.map(cell => `"${cell.textContent?.trim()}"`).join(',');
    }).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
