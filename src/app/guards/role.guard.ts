import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['expectedRole'];
  const userRole = auth.getRole();
  
  if (userRole === expectedRole) {
    return true;
  }
  
  // Redirect to appropriate dashboard based on user role
  if (userRole) {
    switch (userRole) {
      case 'Doctor':
        router.navigate(['doctor-dashboard']);
        break;
      case 'Intern':
        router.navigate(['intern-dashboard']);
        break;
      case 'Admin':
        router.navigate(['admin-dashboard']);
        break;
      default:
        router.navigate(['dashboard']);
        break;
    }
  } else {
    router.navigate(['login']);
  }
  
  return false;
};