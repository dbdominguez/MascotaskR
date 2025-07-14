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
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@#$%^&*.,_~+=-])[A-Za-z\d!?@#$%^&*.,_~+=-]{8,12}$/)]]
    });
  }

  //Iniciar sesion
async ingresar() {
  if (this.loginForm.valid) {
    const correo = this.loginForm.get('email')?.value;
    const clave = this.loginForm.get('clave')?.value;

    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
      spinner: 'circles',
      duration: 1500,
      cssClass: 'custom-loading'
    });

    await loading.present();

    const loginExitoso = await this.authService.login(correo, clave);

    if (loginExitoso) {
      const navigationExtras: NavigationExtras = {
        state: { correo }
      };

      setTimeout(() => {
        this.router.navigate(['/tabs/home'], navigationExtras);
      }, 1500);
    } else {
      await this.mostrarAlerta('Error', 'Correo o clave incorrectos');
    }

  } else {
    alert('Completa correctamente los campos.');
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