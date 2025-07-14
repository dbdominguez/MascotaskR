import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenService } from '../services/authen.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('🛡️ AuthGuard ejecutado');

    const usuario = localStorage.getItem('usuarioActual');

    const autenticado = usuario !== null;

    console.log('¿Está autenticado?', autenticado);

    if (!autenticado) {
      this.router.navigate(['/login']);
    }

    return autenticado;
  }
}