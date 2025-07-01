import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  constructor(private http: HttpClient, private storage: Storage) {}

  async hayConexion(): Promise<boolean> {
    const estado = await Network.getStatus();
    return estado.connected;
  }

  async getCategorias(): Promise<any[]> {
    try {
      const response: any = await this.http.get(this.apiUrl).toPromise();
      const categorias = response.categories || [];

      // Guardar categorías 
      await this.storage.set('categoriasComida', categorias);
      console.log('[API] Categorías obtenidas de la API y guardadas en Storage:', categorias);
      return categorias;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      const guardadas = await this.storage.get('categoriasComida');
      console.warn('[STORAGE] Mostrando categorías guardadas anteriormente (sin conexión):', guardadas);
      return guardadas || [];
    }
  }

  async guardarCategoriaSiNoExiste(categoria: any) {
    const clave = `categoria_${categoria.idCategory}`;
    const existente = await this.storage.get(clave);
    if (!existente && categoria.strCategory) {
      await this.storage.set(clave, categoria);
    }
  }

  async getCategoriaGuardada(id: string): Promise<any | null> {
    const clave = `categoria_${id}`;
    console.log(`[STORAGE] Recuperando categoría guardada con clave '${clave}'`);
    return await this.storage.get(clave);
  }
}