import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
  standalone: false,
})
export class EditarPerfilComponent implements OnInit {
  nombre: string = '';
  fechaNacimiento: string = '';
  correo: string = '';
  genero: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const guardado = localStorage.getItem('perfilUsuario');
    if (guardado) {
      const datos = JSON.parse(guardado);
      this.nombre = datos.nombre || '';
      this.fechaNacimiento = datos.fechaNacimiento || '';
      this.correo = datos.correo || '';
      this.genero = datos.genero || '';
    }
  }

  guardar() {
  const datosPerfil = {
    nombre: this.nombre || 'Guardian Estelar',
    fechaNacimiento: this.fechaNacimiento || '',
    correo: this.correo || '',
    genero: this.genero || ''
  };

  localStorage.setItem('perfilUsuario', JSON.stringify(datosPerfil));
  this.modalCtrl.dismiss('actualizado');
}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}