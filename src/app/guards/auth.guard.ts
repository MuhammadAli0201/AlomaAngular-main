import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

//protect dashboards
// CanActivateFn returns boolean values
export const authGuard: CanActivateFn = (route, state) => {
  // Use inject() to get service instances in a functional guard
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
