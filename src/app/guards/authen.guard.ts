import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenService } from '../services/authen.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    console.log('🛡️ AuthGuard ejecutado');

  return this.authService.isAuthenticated().then(autenticado => {
    console.log('¿Está autenticado?', autenticado);
    if (!autenticado) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  });
}
}