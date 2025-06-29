import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, catchError, tap, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=salad';

  constructor(private http: HttpClient, private storage: Storage) {}

  getRecetas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(async (data) => {
        await this.storage.set('recetasCache', data);
      }),
      catchError((error: HttpErrorResponse): Observable<any[]> => {
        console.warn('⚠️ Error al llamar al API, usando datos cache:', error.status);

        // Convertimos la promesa del storage a Observable con `from`
        return from(
          this.storage.get('recetasCache').then((cache) => cache || [])
        );
      })
    );
  }
}
