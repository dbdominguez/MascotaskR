import { Component } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: false,
})
export class ProgresoPage {
  historial: any[] = [];
  promedioCumplimiento: number = 0;
  diasCompletos: number = 0;

  constructor(private sqliteService: SqliteService) {}

  //Cargar sql
  async ionViewWillEnter() {
    this.historial = await this.sqliteService.obtenerHistorialProgreso();

    // Calcular resumen estadístico
    if (this.historial.length > 0) {
      let sumaPorcentaje = 0;
      let dias100 = 0;

      this.historial.forEach(entry => {
        const porcentaje = (entry.cumplidos / entry.total) * 100;
        sumaPorcentaje += porcentaje;
        if (porcentaje === 100) dias100++;
      });

      this.promedioCumplimiento = Math.round(sumaPorcentaje / this.historial.length);
      this.diasCompletos = dias100;
    }
  }

  
//Modo debug usar false para desactivar
  modoDebug = true; 

  async mostrarToast(mensaje: string) {
  const toast = document.createElement('ion-toast');
  toast.message = mensaje;
  toast.duration = 1500;
  toast.color = 'warning';
  document.body.appendChild(toast);
  await toast.present();
}

async resetProgreso() {
  await this.sqliteService.borrarProgresoDiario();
  this.historial = [];
  this.promedioCumplimiento = 0;
  this.diasCompletos = 0;
  this.mostrarToast('🚫 Progreso diario eliminado para pruebas');
}
}
