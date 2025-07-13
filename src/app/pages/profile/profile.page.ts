import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditarPerfilComponent } from 'src/app/modals/editar-perfil/editar-perfil.component';
import { ConfiguracionComponent } from 'src/app/modals/configuracion/configuracion.component';
import { CerrarSesionComponent } from 'src/app/modals/cerrar-sesion/cerrar-sesion.component';

import { Storage } from '@ionic/storage-angular';
import { SqliteService } from 'src/app/services/sqlite.service';

//Camara
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  perfil: any = {
    apodo: 'Guardian Estelar',
    fechaNacimiento: '',
    correo: '',
    genero: ''
  };

  fotoPerfil: string = '';

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private sqliteService: SqliteService
  ) {}

  async ionViewWillEnter() {
    console.log('Actualizando perfil...');

    const datos = await this.storage.get('usuario');
    if (datos) {
      this.perfil.nombre = datos.apodo || 'Guardian Estelar';
      this.perfil.fechaNacimiento = datos.fecha_nacimiento || '';
      this.perfil.correo = datos.correo || '';
      this.perfil.genero = datos.genero || '';
    }

    this.fotoPerfil = await this.storage.get('fotoPerfil') || '';
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.fotoPerfil = image.dataUrl!;
    await this.storage.set('fotoPerfil', this.fotoPerfil);
  }

  async abrirEditarPerfil() {
    const modal = await this.modalCtrl.create({
      component: EditarPerfilComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data === 'actualizado') {
        this.ionViewWillEnter(); 
      }
    });

    await modal.present();
  }

  async abrirConfiguracion() {
    const modal = await this.modalCtrl.create({
      component: ConfiguracionComponent,
    });
    await modal.present();
  }

  async abrirCerrarSesion() {
    const modal = await this.modalCtrl.create({
      component: CerrarSesionComponent,
    });
    await modal.present();
  }


//Depuracion
async resetDatos() {
  // 🔹 1. Limpiar localStorage
  localStorage.clear();

  // 🔹 2. Limpiar @ionic/storage
  await this.storage.clear();

  // 🔹 3. Limpiar SQLite
  if (this.sqliteService.db) {
    await this.sqliteService.db.execute('DELETE FROM habitos');
    await this.sqliteService.db.execute('DELETE FROM progreso_diario');
    await this.sqliteService.db.execute('DELETE FROM usuarios');
  }

  console.log('✅ Todos los datos han sido limpiados.');
}


}
