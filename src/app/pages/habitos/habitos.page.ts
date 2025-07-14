import { Component } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Storage } from '@ionic/storage-angular';

interface Habito {
  id: number;
  nombre: string;
  dias: string[];
  hora: string;
  categoria: string;
  completado: boolean;
}

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone: false,
})
export class HabitosPage {
  formularioVisible = false;
  mostrarAnimacion = false;

  categorias = [' Salud', ' Alimentación', ' Ejercicio', ' Otro'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  habitosGuardados: Habito[] = [];

  nuevoHabito: Habito = {
    id: 0,
    nombre: '',
    dias: [],
    hora: '',
    categoria: '',
    completado: false,
  };

  modoEdicion = false;
  indiceEdicion = -1;

  constructor(private storage: Storage) {}

  async ionViewWillEnter() {
    const data = localStorage.getItem('habitos');
    this.habitosGuardados = data ? JSON.parse(data) : [];
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.indiceEdicion = -1;
    this.nuevoHabito = {
      id: 0,
      nombre: '',
      dias: [],
      hora: '',
      categoria: '',
      completado: false,
    };
    this.formularioVisible = true;
  }


  async guardarHabito() {
    let habitos = JSON.parse(localStorage.getItem('habitos') || '[]');

    if (!this.modoEdicion) {
      const nuevoId = habitos.length ? habitos[habitos.length - 1].id + 1 : 1;
      const nuevo = { ...this.nuevoHabito, id: nuevoId };
      habitos.push(nuevo);
      await this.programarNotificacion(nuevo, nuevoId);
      this.mostrarAnimacion = true;
      setTimeout(() => (this.mostrarAnimacion = false), 1500);
    } else {
      const index = habitos.findIndex((h: Habito) => h.id === this.nuevoHabito.id);
      if (index !== -1) {
        await LocalNotifications.cancel({ notifications: [{ id: this.nuevoHabito.id }] });
        habitos[index] = { ...this.nuevoHabito };
        await this.programarNotificacion(this.nuevoHabito, this.nuevoHabito.id);
      }
    }

    localStorage.setItem('habitos', JSON.stringify(habitos));
    this.formularioVisible = false;
    this.modoEdicion = false;
    this.nuevoHabito = {
      id: 0,
      nombre: '',
      dias: [],
      hora: '',
      categoria: '',
      completado: false,
    };
    await this.ionViewWillEnter();
  }

  editarHabito(habito: Habito) {
    this.modoEdicion = true;
    this.nuevoHabito = { ...habito };
    this.formularioVisible = true;
  }

  async eliminarHabito(id: number) {
    let habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
    habitos = habitos.filter((h: Habito) => h.id !== id);
    await LocalNotifications.cancel({ notifications: [{ id }] });
    localStorage.setItem('habitos', JSON.stringify(habitos));
    await this.ionViewWillEnter();
  }

  filtrarPorCategoria(categoria: string): Habito[] {
    return this.habitosGuardados.filter((h) => h.categoria === categoria);
  }

  async programarNotificacion(habito: Habito, id: number) {
    await this.storage.create();

    const notificacionesActivas = await this.storage.get('notificacionesActivas');
    if (!notificacionesActivas) {
      console.log('🔕 Notificaciones desactivadas desde configuración.');
      return;
    }

    const permStatus = await LocalNotifications.requestPermissions();
    if (permStatus.display !== 'granted') {
      console.warn('🔕 Permiso para notificaciones no concedido');
      return;
    }

    if (!id || isNaN(id)) {
      console.error('❌ ID inválido para notificación:', id);
      return;
    }

    const [hora, minuto] = habito.hora.split(':').map((val: string) => parseInt(val));
    let fecha = new Date();
    fecha.setHours(hora, minuto, 0, 0);

    if (fecha <= new Date()) {
      fecha.setDate(fecha.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title: '📌 Recordatorio de hábito',
          body: `Es momento de: ${habito.nombre}`,
          schedule: {
            at: fecha,
            repeats: true,
          },
        },
      ],
    });

    console.log(`🔔 Notificación programada para ${habito.nombre} a las ${habito.hora}`);
  }
}