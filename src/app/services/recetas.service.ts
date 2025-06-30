import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  constructor(private http: HttpClient, private storage: Storage) {}

  async getCategorias() {
    try {
      const response: any = await this.http.get(this.apiUrl).toPromise();
      const categorias = response.categories || [];
      
      // Guardar en storage local
      await this.storage.set('categoriasComida', categorias);
      return categorias;
    } catch (error: any) {
      console.error('Error al consumir API:', error);

      // Código 404 u otro error → mostrar datos previos
      const categoriasPrevias = await this.storage.get('categoriasComida');
      return categoriasPrevias || [];
    }
  }
}