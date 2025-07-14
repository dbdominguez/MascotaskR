import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  constructor() {}

  async login(correo: string, clave: string): Promise<boolean> {
    const usuariosStr = localStorage.getItem('usuarios');
    const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    const usuario = usuarios.find((u: any) => u.correo === correo && u.clave === clave);

    if (usuario) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('usuarioActual');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('usuarioActual');
  }
}