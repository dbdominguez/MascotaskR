import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router,private alertCtrl: AlertController,private sqliteService: SqliteService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      genero: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }

  async onSubmit() {
    const { nombre, genero, fecha_nacimiento, correo, clave } = this.registerForm.value;

    const existe = await this.sqliteService.existeUsuario(correo);

    if (existe) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Este correo ya está registrado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    await this.sqliteService.registrarUsuario(nombre, genero, fecha_nacimiento, correo, clave);

    this.router.navigate(['/home']);
  }
}