import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  buscarRecetas(termino: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search.php?s=${termino}`);
  }
}
