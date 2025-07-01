import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { RecetasService } from '../../services/recetas.service';
import { DetalleComidaComponent } from '../../modals/detalle-comida/detalle-comida.component';
import { LogrosComponent } from '../../modals/logros/logros.component';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
  standalone: false,
})
export class ExtrasPage {
  categorias: any[] = [];

  constructor(
    private recetasService: RecetasService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

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
  const online = await this.recetasService.hayConexion();
  const clave = `categoria_${categoria.idCategory}`;

  if (online) {
    // Guarda solo si no existe
    const yaGuardada = await this.recetasService.getCategoriaGuardada(categoria.idCategory);
    if (!yaGuardada) {
      await this.recetasService.guardarCategoriaSiNoExiste(categoria);
      console.log('✔️ Receta guardada localmente:', categoria.strCategory);
    }
  }

  const categoriaGuardada = await this.recetasService.getCategoriaGuardada(categoria.idCategory);
  console.log('🔍 Intentando cargar:', clave, categoriaGuardada);

  if (categoriaGuardada && categoriaGuardada.strCategory) {
    const modal = await this.modalCtrl.create({
      component: DetalleComidaComponent,
      componentProps: { categoria: categoriaGuardada }
    });
    await modal.present();
  } else {
    const alerta = await this.alertCtrl.create({
      header: 'Sin conexión',
      message: 'Esta receta no está disponible sin conexión. Conéctate para verla.',
      buttons: ['OK']
    });
    await alerta.present();
  }
}
}