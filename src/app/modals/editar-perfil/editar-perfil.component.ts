import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SqliteService } from 'src/app/services/sqlite.service';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
  standalone: false,
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private sqliteService: SqliteService,
    private storage: Storage
  ) {
    this.perfilForm = this.fb.group({
      apodo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  async ngOnInit() {
    const usuario = await this.storage.get('usuario');

    if (usuario) {
      this.perfilForm.patchValue({
        apodo: usuario.apodo,
        fechaNacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero
      });
    }
  }

  async guardarCambios() {
    if (!this.perfilForm.valid) return;

    const nuevosDatos = this.perfilForm.value;

    const usuario = await this.storage.get('usuario');
    if (!usuario) return;

    const db = await this.sqliteService.getDB();

    // Actualizar en SQLite
    await db.run(
      `UPDATE usuarios
       SET apodo = ?, fecha_nacimiento = ?, genero = ?
       WHERE id = ?`,
      [nuevosDatos.apodo, nuevosDatos.fechaNacimiento, nuevosDatos.genero, usuario.id]
    );

    // Actualizar en Storage
    const usuarioActualizado = {
      ...usuario,
      apodo: nuevosDatos.apodo,
      fecha_nacimiento: nuevosDatos.fechaNacimiento,
      genero: nuevosDatos.genero
    };

    await this.storage.set('usuario', usuarioActualizado);

    // Cerrar modal y notificar actualización
    this.modalCtrl.dismiss('actualizado');
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}