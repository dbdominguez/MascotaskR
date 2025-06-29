import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone: false,
})
export class HabitosPage {
  formularioVisible = false;
  mostrarAnimacion = false;

  categorias = ['❤️ Salud', '🍴 Alimentación', '💪 Ejercicio', '🎱 Otro'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  habitosGuardados: any[] = [];

  nuevoHabito = {
    nombre: '',
    dias: [],
    hora: '',
    categoria: '',
    completado: false
  };

  modoEdicion = false;
  indiceEdicion = -1;

  ionViewWillEnter() {
    const guardados = JSON.parse(localStorage.getItem('habitosHoy') || '[]');
    this.habitosGuardados = guardados;
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

  guardarHabito() {
  const habitos = JSON.parse(localStorage.getItem('habitosHoy') || '[]');

  if (!this.modoEdicion) {
    const nuevo = {
      ...this.nuevoHabito,
      id: Date.now(),
      completado: false
    };
    habitos.push(nuevo);

    // ✅ Activar animación
    this.mostrarAnimacion = true;
    setTimeout(() => {
      this.mostrarAnimacion = false;
    }, 1500);
  } else {
    habitos[this.indiceEdicion] = this.nuevoHabito;
  }

  localStorage.setItem('habitosHoy', JSON.stringify(habitos));
  this.formularioVisible = false;
  this.ionViewWillEnter();
}

  editarHabito(habito: any, index: number) {
    this.modoEdicion = true;
    this.indiceEdicion = index;
    this.nuevoHabito = { ...habito };
    this.formularioVisible = true;
  }

  eliminarHabito(index: number) {
    const habitos = JSON.parse(localStorage.getItem('habitosHoy') || '[]');
    habitos.splice(index, 1);
    localStorage.setItem('habitosHoy', JSON.stringify(habitos));
    this.ionViewWillEnter();
  }

  filtrarPorCategoria(categoria: string): any[] {
    return this.habitosGuardados.filter(h => h.categoria === categoria);
  }
}