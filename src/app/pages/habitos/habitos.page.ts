import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';

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


  constructor(private sqliteService: SqliteService, ) {}

  
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
      await this.sqliteService.agregarHabito(nuevo);
      this.mostrarAnimacion = true;
      setTimeout(() => {
        this.mostrarAnimacion = false;
      }, 1500);
    } else {
      if (this.nuevoHabito.id) {
        await this.sqliteService.editarHabito(this.nuevoHabito);
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
    await this.sqliteService.eliminarHabito(id);
    await this.ionViewWillEnter();
  }

  filtrarPorCategoria(categoria: string): any[] {
    return this.habitosGuardados.filter(h => h.categoria === categoria);
  }
}