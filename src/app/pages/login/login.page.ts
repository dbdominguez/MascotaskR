import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController,  AlertController } from '@ionic/angular';

import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private authService: AuthenService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@#$%^&*.,_~+=-])[A-Za-z\d!?@#$%^&*.,_~+=-]{8,12}$/)
      ]]
    });
  }

  //Iniciar sesion
  async ingresar() {
    if (!this.loginForm.valid) {
      this.mostrarAlerta('Campos incompletos o inválidos', 'Completa correctamente los campos.');
      return;
    }

    const correo = this.loginForm.get('email')?.value;
    const clave = this.loginForm.get('clave')?.value;

    const loading = await this.loadingCtrl.create({
      message: 'Verificando...',
      spinner: 'circles',
      duration: 1500,
      cssClass: 'custom-loading'
    });

    await loading.present();

    const usuario = await this.authService.login(correo, clave);

    if (usuario) {
      const navigationExtras: NavigationExtras = {
        state: { usuario: usuario }
      };

      this.router.navigate(['/tabs/home'], navigationExtras);
    } else {
      this.mostrarAlerta('Error de inicio de sesión', 'Correo o contraseña incorrectos.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}