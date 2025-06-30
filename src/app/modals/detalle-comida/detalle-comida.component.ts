import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-comida',
  templateUrl: './detalle-comida.component.html',
  styleUrls: ['./detalle-comida.component.scss'],
  standalone: false,
})
export class DetalleComidaComponent {
  @Input() categoria: any;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}