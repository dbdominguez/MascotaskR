import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Storage
import { IonicStorageModule } from '@ionic/storage-angular';
//API
import { provideHttpClient } from '@angular/common/http';
//Guard
import { AuthGuard } from './guards/authen.guard';


// Importar modales
import { EditarPerfilComponent } from './modals/editar-perfil/editar-perfil.component';
import { ConfiguracionComponent } from './modals/configuracion/configuracion.component';
import { CerrarSesionComponent } from './modals/cerrar-sesion/cerrar-sesion.component';
import { LogrosComponent } from './modals/logros/logros.component';
import { DetalleComidaComponent } from 'src/app/modals/detalle-comida/detalle-comida.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditarPerfilComponent,
    ConfiguracionComponent,
    CerrarSesionComponent,
    LogrosComponent,
    DetalleComidaComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(), AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

