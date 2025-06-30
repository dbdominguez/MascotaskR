import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private STORAGE_KEY = 'usuario';

  constructor(private storage: Storage) {}

  async login(correo: string): Promise<void> {
    await this.storage.set(this.STORAGE_KEY, { correo });
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.STORAGE_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const usuario = await this.storage.get(this.STORAGE_KEY);
    return !!usuario;
  }
}
