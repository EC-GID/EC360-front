import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Auth } from '../auth';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

interface TimeLog {
  full_name: string;
  check_in: string;
  check_out: string | null;
  duration_minutes: number;
}

@Component({
  selector: 'app-admin-time-logs',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-time-tracker-logs.html',
  styleUrls: ['./admin-time-tracker-logs.css']
})
export class AdminTimeLogsComponent implements OnInit {
  logs: TimeLog[] = [];
  filteredLogs: TimeLog[] = [];
  errorMessage = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalMinutes = 0;

  darkMode = false;

  constructor(private http: HttpClient, private auth: Auth, private router: Router,) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });

    this.http.get<TimeLog[]>('https://ec360-production.up.railway.app/admin/time-logs', { headers }).subscribe({
      next: (data) => {
        this.logs = data;
        this.totalMinutes = data.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
        this.applyFilters();
        this.autoRefresh();
      },
      error: (err) =>
        (this.errorMessage = err?.error?.error || 'Failed to load time logs.')
    });
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      log.full_name.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  paginatedLogs(): TimeLog[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLogs.slice(start, start + this.itemsPerPage);
  }

  exportCSV(): void {
    try {
      const headers = ['User', 'Check-in', 'Check-out', 'Duration (min)'];
      const rows = this.logs.map(log => [
        log.full_name,
        log.check_in,
        log.check_out || '',
        log.duration_minutes.toString()
      ]);

      const csv = [headers, ...rows]
        .map(row => row.map(val => `"${val}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'time-logs.csv');
      alert('✅ CSV export completed.');
    } catch (err) {
      alert('❌ CSV export failed.');
    }
  }

  exportPDF(): void {
    try {
      const doc = new jsPDF();
      doc.text('All Time Logs', 14, 15);

      autoTable(doc, {
        startY: 20,
        head: [['User', 'Check-in', 'Check-out', 'Duration (min)']],
        body: this.logs.map(log => [
          log.full_name,
          log.check_in,
          log.check_out || '',
          log.duration_minutes
        ])
      });

      doc.save('time-logs.pdf');
      alert('✅ PDF export completed.');
    } catch (err) {
      alert('❌ PDF export failed.');
    }
  }

  exportExcel(): void {
    const worksheetData = [
      ['User', 'Check-in', 'Check-out', 'Duration (min)'],
      ...this.logs.map(log => [
        log.full_name,
        log.check_in,
        log.check_out || '',
        log.duration_minutes || 0
      ])
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Time Logs': worksheet },
      SheetNames: ['Time Logs']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'time-logs.xlsx');
  }

  goToNextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredLogs.length) {
      this.currentPage++;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  autoRefresh(): void {
    setInterval(() => {
      this.ngOnInit();
    }, 2 * 60 * 1000);
  }

   Admindashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
