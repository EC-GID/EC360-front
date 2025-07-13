import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee, EmployeesService } from '../employees';
import { Department, DepartmentService } from '../department.services';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employeeslist.html',
  styleUrls: ['./employeeslist.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];

  employeeForm: FormGroup;
  editForm: FormGroup;

  selectedId: number | null = null;

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      department_id: [null, Validators.required],
      date_hired: ['']
    });

    this.editForm = this.fb.group({
      id: [null],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      department_id: [null, Validators.required],
      date_hired: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees() {
    this.employeesService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: () => this.errorMessage = 'Failed to load employees'
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: () => this.errorMessage = 'Failed to load departments'
    });
  }

  getDepartmentName(deptId: number | null): string {
    const dept = this.departments.find(d => d.id === deptId);
    return dept ? dept.name : 'N/A';
  }

  createEmployee() {
    if (this.employeeForm.invalid) return;
    this.loading = true;

    this.employeesService.createEmployee(this.employeeForm.value).subscribe({
      next: () => {
        this.successMessage = 'Employee created';
        this.employeeForm.reset();
        this.loadEmployees();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to create employee';
        this.loading = false;
      }
    });
  }

  editEmployee(emp: Employee) {
    this.selectedId = emp.id!;
    this.editForm.setValue({
      id: emp.id,
      full_name: emp.full_name,
      email: emp.email,
      position: emp.position || '',
      department_id: emp.department_id || null,
      date_hired: emp.date_hired || ''
    });
  }

  updateEmployee() {
    if (this.editForm.invalid) return;
    const id = this.editForm.value.id;
    this.loading = true;

    this.employeesService.updateEmployee(id, this.editForm.value).subscribe({
      next: () => {
        this.successMessage = 'Employee updated';
        this.selectedId = null;
        this.loadEmployees();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update employee';
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: number) {
    if (!confirm('Delete employee?')) return;
    this.loading = true;

    this.employeesService.deleteEmployee(id).subscribe({
      next: () => {
        this.successMessage = 'Employee deleted';
        this.loadEmployees();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to delete employee';
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.selectedId = null;
    this.editForm.reset();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
