import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, DepartmentService } from '../department.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="department-container">
      <h2>📁 Department Management</h2>

      <form (ngSubmit)="createDepartment()" class="department-form" novalidate>
        <h3>➕ Create New Department</h3>

        <label for="deptName">Department Name</label>
        <input
          id="deptName"
          [(ngModel)]="newDepartment.name"
          name="name"
          placeholder="Enter department name"
          required
          [disabled]="loading"
        />
        <div *ngIf="!newDepartment.name.trim() && errorMessage" class="error">
          ⚠️ Department name is required
        </div>

        <label for="deptDesc">Description</label>
        <textarea
          id="deptDesc"
          [(ngModel)]="newDepartment.description"
          name="description"
          placeholder="Optional description"
          [disabled]="loading"
        ></textarea>

        <button type="submit" [disabled]="loading || !newDepartment.name.trim()">
          ➕ Create Department
        </button>
      </form>

      <div *ngIf="selectedDepartment" class="edit-form">
        <h3>✏️ Edit Department</h3>

        <label for="editName">Department Name</label>
        <input
          id="editName"
          [(ngModel)]="selectedDepartment.name"
          name="editName"
          placeholder="Edit name"
          required
          [disabled]="loading"
        />

        <label for="editDesc">Description</label>
        <textarea
          id="editDesc"
          [(ngModel)]="selectedDepartment.description"
          name="editDescription"
          placeholder="Edit description"
          [disabled]="loading"
        ></textarea>

        <div class="form-actions">
          <button (click)="updateDepartment()" [disabled]="loading || !selectedDepartment.name.trim()">💾 Update</button>
          <button (click)="clearSelection()" type="button" [disabled]="loading">❌ Cancel</button>
        </div>
      </div>

      <hr />

      <ul *ngIf="departments.length" class="department-list">
        <li *ngFor="let d of departments">
          <div class="dept-info">
            <strong>{{ d.name }}</strong> — {{ d.description || 'No description' }}
          </div>
          <div class="actions">
            <button (click)="selectDepartment(d)" [disabled]="loading">✏️ Edit</button>
            <button (click)="deleteDepartment(d.id!)" [disabled]="loading">🗑️ Delete</button>
          </div>
        </li>
      </ul>

      <p *ngIf="!departments.length && !errorMessage">No departments found.</p>


      <div class="success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>


      <button class="back-btn" type="button" (click)="goBack()">🔙 Back to Dashboard</button>
    </div>
  `,
  styleUrls: ['./department.css']
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartment: Department | null = null;
  newDepartment: Department = { name: '', description: '' };
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private departmentService: DepartmentService, private router: Router) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: () => this.errorMessage = '❌ Failed to load departments'
    });
  }

  selectDepartment(dept: Department) {
    this.selectedDepartment = { ...dept };
    this.clearMessages();
  }

  clearSelection() {
    this.selectedDepartment = null;
    this.clearMessages();
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  createDepartment() {
    if (!this.newDepartment.name.trim()) {
      this.errorMessage = '⚠️ Department name is required';
      return;
    }
    this.loading = true;
    this.clearMessages();

    this.departmentService.createDepartment(this.newDepartment).subscribe({
      next: () => {
        this.successMessage = '✅ Department created successfully';
        this.newDepartment = { name: '', description: '' };
        this.loadDepartments();
      },
      error: () => this.errorMessage = '❌ Failed to create department',
      complete: () => this.loading = false
    });
  }

  updateDepartment() {
    if (!this.selectedDepartment || !this.selectedDepartment.name.trim()) {
      this.errorMessage = '⚠️ Department name is required';
      return;
    }
    this.loading = true;
    this.clearMessages();

    this.departmentService.updateDepartment(this.selectedDepartment.id!, this.selectedDepartment).subscribe({
      next: () => {
        this.successMessage = '✏️ Department updated';
        this.loadDepartments();
        this.clearSelection();
      },
      error: () => this.errorMessage = '❌ Failed to update department',
      complete: () => this.loading = false
    });
  }

  deleteDepartment(id: number) {
    if (!confirm('🗑️ Are you sure you want to delete this department?')) return;
    this.loading = true;
    this.clearMessages();

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.successMessage = '🗑️ Department deleted';
        this.loadDepartments();
      },
      error: () => this.errorMessage = '❌ Failed to delete department',
      complete: () => this.loading = false
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
