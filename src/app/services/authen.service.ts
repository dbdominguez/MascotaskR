import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private readonly STORAGE_KEY = 'usuario_activo';

  constructor(private storage: Storage) {}

  async login(email: string): Promise<void> {
    await this.storage.set(this.STORAGE_KEY, email);
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.STORAGE_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const usuario = await this.storage.get(this.STORAGE_KEY);
    return !!usuario;
  }
}
