import { Routes } from '@angular/router';

import { Register } from './register/register';
import { Login } from './login/login';
import { AdminGuard } from './login/admin.guard';
import { WorkerGuard } from './login/worker.guard';
import { DepartmentListComponent } from './department/department';
import { EmployeeListComponent } from './employeeslist/employeeslist';
import { TimeTrackerComponent } from './time-tracker/time-tracker';
import { AdminTimeLogsComponent } from './admin-time-tracker-logs/admin-time-tracker-logs';
import { WorkLogs } from './work-logs/work-logs';
import { Approval } from './approval/approval';
import { VerifyEmailComponent } from './verify-email/verify-email';
import { ResetPassword } from './reset-password/reset-password';
import { ForgotPassword } from './forgot-password/forgot-password';
import { AdminWeeklyPayments } from './admin-weekly-payments/admin-weekly-payments';
import { Dashboard } from './login/adimin.dashboard';
import { WorkerDashboard } from './login/worker.dashboard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.HomeComponent)
  },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPassword},
  { path: 'reset-password', component: ResetPassword },


  { path: 'dashboard', component: Dashboard, canActivate: [AdminGuard] },
  { path: 'department', component: DepartmentListComponent, canActivate: [AdminGuard] },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AdminGuard] },
  { path: 'admin-logs', component: AdminTimeLogsComponent, canActivate: [AdminGuard] },
  { path: 'approve-users', component: Approval, canActivate: [AdminGuard] },
  {path: 'admin/weekly-payments',component: AdminWeeklyPayments, canActivate: [AdminGuard]},

  { path: 'worker-dashboard', component: WorkerDashboard, canActivate: [WorkerGuard] },
  { path: 'check-in', component: TimeTrackerComponent, canActivate: [WorkerGuard] },
  { path: 'my-logs', component: WorkLogs, canActivate: [WorkerGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '**', redirectTo: 'home' }
];

