import { Component, OnInit} from '@angular/core';
import { RecetasService } from 'src/app/services/recetas.service';

//Modal
import { ModalController } from '@ionic/angular';
import { LogrosComponent } from 'src/app/modals/logros/logros.component';
import { DetalleComidaComponent } from 'src/app/modals/detalle-comida/detalle-comida.component';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
  standalone: false,
})
export class ExtrasPage {

  categorias: any[] = [];

  constructor(private recetasService: RecetasService, private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    this.cargarCategorias();
  }

  async cargarCategorias() {
    this.categorias = await this.recetasService.getCategorias();
  }

  async abrirLogros() {
    const modal = await this.modalCtrl.create({
      component: LogrosComponent,
    });
    await modal.present();
  }

  async verDetalle(categoria: any) {
    const modal = await this.modalCtrl.create({
      component: DetalleComidaComponent,
      componentProps: { categoria }
    });

    await modal.present();
  }
}
