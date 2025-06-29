import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss'],
  standalone: false,
})
export class LogrosComponent implements OnInit {
  //Listado Logros
  logros = [
    {
      nombre: 'Primer hábito',
      descripcion: 'Has creado tu primer hábito.',
      icono: 'star-outline',
      desbloqueado: false
    },
    {
      nombre: 'Constante',
      descripcion: 'Completaste hábitos 5 días seguidos.',
      icono: 'flame-outline',
      desbloqueado: false
    },
    {
      nombre: 'Maestro de hábitos',
      descripcion: 'Completaste todos tus hábitos en un día.',
      icono: 'trophy-outline',
      desbloqueado: false
    },
    {
      nombre: 'Explorador',
      descripcion: 'Entraste a la página de Extras.',
      icono: 'rocket-outline',
      desbloqueado: true
    }
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.verificarLogros();
  }

  verificarLogros() {
    const habitos = JSON.parse(localStorage.getItem('habitosHoy') || '[]');
    const progreso = JSON.parse(localStorage.getItem('progresoHabitos') || '{}');

    this.logros.forEach(logro => {
      switch (logro.nombre) {
        case 'Primer hábito':
          logro.desbloqueado = habitos.length > 0;
          break;
        case 'Maestro de hábitos':
          logro.desbloqueado = habitos.every((h: any) => h.completado);
          break;
        case 'Constante':
          const dias = Object.keys(progreso).filter(fecha => progreso[fecha].length > 0);
          logro.desbloqueado = dias.length >= 5;
          break;
      }
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}