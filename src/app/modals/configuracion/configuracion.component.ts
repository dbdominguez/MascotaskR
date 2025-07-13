import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  standalone: false,
})
export class ConfiguracionComponent {
  notificacionesActivas: boolean = true;
  sonidoActivo: boolean = true;
  
  constructor(private modalCtrl: ModalController,private storage: Storage) {}

  async ionViewWillEnter() {
    await this.storage.create();
    const noti = await this.storage.get('notificacionesActivas');
    const sonido = await this.storage.get('sonidoActivo');

    this.notificacionesActivas = noti !== null ? noti : true;
    this.sonidoActivo = sonido !== null ? sonido : true;
  }

  async toggleNotificaciones() {
    await this.storage.set('notificacionesActivas', this.notificacionesActivas);
  }

  async toggleSonido() {
    await this.storage.set('sonidoActivo', this.sonidoActivo);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}