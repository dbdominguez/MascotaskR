import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Storage } from '@ionic/storage-angular';

interface Habito {
  id?: number;
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


  constructor(private sqliteService: SqliteService, private storage: Storage) {}

  
  formularioVisible = false;
  mostrarAnimacion = false;
  

  categorias = ['❤️ Salud', '🍴 Alimentación', '💪 Ejercicio', '🎱 Otro'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  habitosGuardados: any[] = [];

  nuevoHabito: Habito = {
    nombre: '',
    dias: [],
    hora: '',
    categoria: '',
    completado: false
};

  modoEdicion = false;
  indiceEdicion = -1;

formatearHora(valor: string) {
  const hora = valor.split('T')[1]?.substring(0, 5);
  if (hora) {
    this.nuevoHabito.hora = hora;
  } else {
    console.warn('⚠️ Hora inválida recibida:', valor);
  }
}

  async ionViewWillEnter() {
    const datos = await this.sqliteService.obtenerHabitosHoy();

    this.habitosGuardados = datos.map(h => ({
      ...h,
      dias: h.dias ? h.dias.split(',') : [] 
    }));
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.indiceEdicion = -1;
    this.nuevoHabito = {
      nombre: '',
      dias: [],
      hora: '',
      categoria: '',
      completado: false
    };
    this.formularioVisible = true;
  }

  async guardarHabito() {
    if (!this.modoEdicion) {
      const nuevo = {
        nombre: this.nuevoHabito.nombre,
        categoria: this.nuevoHabito.categoria,
        hora: this.nuevoHabito.hora,
        dias: this.nuevoHabito.dias,
      };

      // Guardar y obtener ID
      const id = await this.sqliteService.agregarHabito(nuevo);

      //Verificar
      if (!id || isNaN(id)) {
        console.error('❌ Error: ID inválido recibido al guardar el hábito:', id);
        return;
      }

      // Programar notificación
      await this.programarNotificacion(nuevo, id);

      this.mostrarAnimacion = true;
      setTimeout(() => {
        this.mostrarAnimacion = false;
      }, 1500);
    } else {
      if (this.nuevoHabito.id) {
        const id = this.nuevoHabito.id;

        await LocalNotifications.cancel({ notifications: [{ id }] });
        await this.sqliteService.editarHabito(this.nuevoHabito);
        await this.programarNotificacion(this.nuevoHabito, id);

      } else {
        console.warn('No se pudo editar: hábito sin ID');
      }
    }

    this.formularioVisible = false;
    this.modoEdicion = false;
    this.nuevoHabito = {
      nombre: '',
      dias: [],
      hora: '',
      categoria: '',
      completado: false
    };
    await this.ionViewWillEnter();
  }

  editarHabito(habito: Habito) {
    this.modoEdicion = true;
    this.nuevoHabito = { ...habito };
    this.formularioVisible = true;
  }

  async eliminarHabito(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    await this.sqliteService.eliminarHabito(id);
    await this.ionViewWillEnter();
}

  filtrarPorCategoria(categoria: string): any[] {
    return this.habitosGuardados.filter(h => h.categoria === categoria);
  }

  //Notificaciones Habitos
   async programarNotificacion(habito: any, id: number) {
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

    console.log('⏰ Hora programada local:', fecha.toString());

    console.log('🧪 Notificación programada con:', {
      id,
      title: `📌 Recordatorio de hábito`,
      body: `Es momento de: ${habito.nombre}`,
      fecha,
      fechaISO: fecha.toISOString(),
      horaOriginal: habito.hora
    });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: id,
          title: '📌 Recordatorio de hábito',
          body: `Es momento de: ${habito.nombre}`,
          schedule: {
            at: fecha,
            repeats: true,
          }
        }
      ]
    });

    console.log(`🔔 Notificación programada para ${habito.nombre} a las ${habito.hora}`);
    
    const pendientes = await LocalNotifications.getPending();
    console.log('🕑 Notificaciones pendientes:', pendientes);
  }
}