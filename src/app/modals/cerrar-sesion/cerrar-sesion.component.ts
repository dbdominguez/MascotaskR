import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-cerrar-sesion',
  templateUrl: './cerrar-sesion.component.html',
  styleUrls: ['./cerrar-sesion.component.scss'],
  standalone: false,
})
export class CerrarSesionComponent {
  constructor(private modalCtrl: ModalController, private navCtrl: NavController,private authService: AuthenService) {}

  async dismiss() {
    this.modalCtrl.dismiss();
  }

  async confirmar() {
    await this.authService.logout();              
    await this.modalCtrl.dismiss();               
    this.navCtrl.navigateRoot('/login');         
  }
}
