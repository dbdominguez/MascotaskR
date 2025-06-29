import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
  standalone: false,
})
export class MascotaPage {
  nombreMascota = 'Kitty';
  imagenMascota = 'assets/pet/PetStandar.gif';;

  saludarMascota() {
    const frases = [
      '¡Hola humano! 🐾',
      '¡Estoy feliz de verte!',
      '¿Jugamos un rato?',
      'Recuerda tomar agua 💧',
      '¡Sigue con tus hábitos!'
    ];

    const saludo = frases[Math.floor(Math.random() * frases.length)];
    alert(`${this.nombreMascota} dice: "${saludo}"`);
  }

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController,) {}

  async proximamente() {
  const alerta = await this.alertCtrl.create({
    header: '¡Proximamente!',
    message: 'Esta funcionalidad estará disponible en futuras actualizaciones.',
    buttons: [
      {
        text: 'Ok',
        role: 'cancel'
      },
    ]
  });
  await alerta.present();
}
 
}