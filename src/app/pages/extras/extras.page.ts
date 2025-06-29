import { Component, OnInit} from '@angular/core';
import { RecetasService } from 'src/app/services/recetas.service';

//Modal
import { ModalController } from '@ionic/angular';
import { LogrosComponent } from 'src/app/modals/logros/logros.component';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
  standalone: false,
})
export class ExtrasPage {

  recetas: any[] = [];

  constructor(private recetasService: RecetasService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.recetasService.getRecetas().subscribe(data => {
      this.recetas = data;
    });
  }


  async abrirLogros() {
  const modal = await this.modalCtrl.create({
    component: LogrosComponent,
  });
  await modal.present();
}
}
