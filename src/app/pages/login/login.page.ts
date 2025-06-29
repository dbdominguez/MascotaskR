import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loadingCtrl: LoadingController, private authService: AuthenService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@#$%^&*.,_~+=-])[A-Za-z\d!?@#$%^&*.,_~+=-]{8,12}$/)]]
    });
  }

  //Iniciar sesion
  async ingresar() {
    if (this.loginForm.valid) {
      const correo = this.loginForm.get('email')?.value;

      const perfilGuardado = JSON.parse(localStorage.getItem('perfilUsuario') || '{}');
      if (!perfilGuardado.correo) {
        localStorage.setItem('perfilUsuario', JSON.stringify({
          ...perfilGuardado,
          correo: correo
        }));
      }

      const loading = await this.loadingCtrl.create({
        message: 'Ingresando...',
        spinner: 'circles',
        duration: 1500,
        cssClass: 'custom-loading'
      });

      await loading.present();

    //Guardar sesión antes de redirigir
      await this.authService.login(correo);

      setTimeout(() => {
        const navigationExtras: NavigationExtras = {
          state: { correo: correo }
        };
        this.router.navigate(['/tabs/home'], navigationExtras);
      }, 1500);

    } else {
      alert('Completa correctamente los campos.');
    }
  }
}