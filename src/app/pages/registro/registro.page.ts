import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface Usuario {
  nombre: string;
  genero: string;
  fecha_nacimiento: string;
  correo: string;
  clave: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      genero: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }

  // Obtiene el arreglo de usuarios desde localStorage
  obtenerUsuarios(): Usuario[] {
    const usuariosStr = localStorage.getItem('usuarios');
    return usuariosStr ? JSON.parse(usuariosStr) : [];
  }

  // Guarda el arreglo actualizado en localStorage
  guardarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

async onSubmit() {
  const { nombre, genero, fecha_nacimiento, correo, clave } = this.registerForm.value;

  const usuarios = this.obtenerUsuarios();

  const existe = usuarios.some(u => u.correo === correo);

  if (existe) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Este correo ya está registrado.',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  const nuevoUsuario = { nombre, genero, fecha_nacimiento, correo, clave };

  usuarios.push(nuevoUsuario);
  this.guardarUsuarios(usuarios);

  // ✅ Guardar usuario actual (simulación de sesión iniciada)
  localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));

  this.router.navigate(['/home']);
}
}