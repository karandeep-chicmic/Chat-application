import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { API, ROUTES } from '../../constants/allConstants';

export const canActivate = () => {
  const router = inject(Router);
  if (sessionStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const canActivateLogin = () => {
  const router = inject(Router);
  if (sessionStorage.getItem('token')) {
    return false;
  } else {
    // router.navigate(['/chatHome']);
    return true;
  }
};
