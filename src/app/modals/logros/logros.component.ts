import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss'],
  standalone: false,
})
export class LogrosComponent {
  logros = [
    {
      nombre: 'Primer hábito',
      descripcion: 'Has creado tu primer hábito.',
      icono: 'star-outline',
      desbloqueado: false,
      notificado: false
    },
    {
      nombre: 'Constante',
      descripcion: 'Completaste hábitos 5 días seguidos.',
      icono: 'flame-outline',
      desbloqueado: false,
      notificado: false
    },
    {
      nombre: 'Maestro de hábitos',
      descripcion: 'Completaste todos tus hábitos en un día.',
      icono: 'trophy-outline',
      desbloqueado: false,
      notificado: false
    },
    {
      nombre: '???',
      descripcion: 'Miau-tástico.',
      icono: 'rocket-outline',
      desbloqueado: false,
      notificado: false
    }
  ];

  mostrarAnimacion = false;
  logroAnimado: string | null = null;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController,private sqliteService: SqliteService) {}

  async ngOnInit() {
    await this.sqliteService.initDB();
    this.cargarEstadoDesdeStorage();
    await this.verificarLogros();
  }

  async verificarLogros() {
    const habitos = await this.sqliteService.obtenerHabitosHoy();
    const progreso = JSON.parse(localStorage.getItem('progresoHabitos') || '{}');

    for (let logro of this.logros) {
      let cumplido = false;

      switch (logro.nombre) {
        case 'Primer hábito':
          cumplido = habitos.length > 0;
          break;
        case 'Maestro de hábitos':
          cumplido = habitos.length > 0 && habitos.every((h: any) => h.completado);
          break;
        case 'Constante':
          const dias = Object.keys(progreso).filter(fecha => progreso[fecha].length > 0);
          cumplido = dias.length >= 5;
          break;
      }

      if (cumplido && !logro.desbloqueado) {
        logro.desbloqueado = true;
        logro.notificado = true;
        this.mostrarAnimacionLogro(logro);
      }
    }

    this.guardarEstadoEnStorage();
  }

  async mostrarAnimacionLogro(logro: any) {
    this.logroAnimado = logro.nombre;
    this.mostrarAnimacion = true;

    const toast = await this.toastCtrl.create({
      message: `🎉 ¡Nuevo logro desbloqueado: ${logro.nombre}!`,
      duration: 2500,
      color: 'success'
    });
    toast.present();

    setTimeout(() => {
      this.mostrarAnimacion = false;
      this.logroAnimado = null;
    }, 2000);
  }

  guardarEstadoEnStorage() {
    localStorage.setItem('logrosDesbloqueados', JSON.stringify(this.logros));
  }

  cargarEstadoDesdeStorage() {
    const guardados = JSON.parse(localStorage.getItem('logrosDesbloqueados') || '[]');
    if (guardados.length) {
      this.logros = guardados;
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}