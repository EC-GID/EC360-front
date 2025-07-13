import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.getUserRole() !== 'admin') {
    router.navigate(['/login']); 
    return false;
  }

  return true;
};
export const SuperAdminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.getUserRole() !== 'admin' || auth.getUserId() !== 1) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
