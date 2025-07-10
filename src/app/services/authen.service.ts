import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private STORAGE_KEY = 'usuario';

  constructor(private storage: Storage, private sqliteService: SqliteService) {}

  // Inicia sesión
  async login(correo: string, clave: string): Promise<any | null> {
    const db = await this.sqliteService.getDB();

    const result = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND clave = ?',
      [correo, clave]
    );

    if (result.values && result.values.length > 0) {
      const usuario = result.values[0];
      await this.storage.set(this.STORAGE_KEY, usuario);
      return usuario;
    }

    return null;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await this.storage.remove(this.STORAGE_KEY);
  }

  // Verifica usuario
  async isAuthenticated(): Promise<boolean> {
    const usuario = await this.storage.get(this.STORAGE_KEY);
    return !!usuario;
  }

  // Obtener datos
  async getUsuario(): Promise<any> {
    return await this.storage.get(this.STORAGE_KEY);
  }
}