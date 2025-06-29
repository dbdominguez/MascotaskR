import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenService } from '../services/authen.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const autenticado = await this.authService.isAuthenticated();
    if (!autenticado) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}