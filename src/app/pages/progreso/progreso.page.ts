import { Component } from '@angular/core';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: false,
})
export class ProgresoPage {
  historial: any[] = [];
  resumen = {
    total: 0,
    cumplidos: 0,
    porcentaje: 0
  };

  //Cargar localstorage
  ionViewWillEnter() {
  this.cargarHistorial();
  this.calcularResumen();
  }

  //Cargar historial
  cargarHistorial() {
    const data = JSON.parse(localStorage.getItem('historialHabitos') || '[]');
    this.historial = data;
  }

  //Calcular resumen
  calcularResumen() {
    const total = this.historial.reduce((acc, d) => acc + d.total, 0);
    const cumplidos = this.historial.reduce((acc, d) => acc + d.cumplidos, 0);
    const porcentaje = total > 0 ? Math.round((cumplidos / total) * 100) : 0;

    this.resumen = { total, cumplidos, porcentaje };
  }
}
