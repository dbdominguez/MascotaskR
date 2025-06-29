import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabitosPageRoutingModule } from './habitos-routing.module';

import { HabitosPage } from './habitos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HabitosPageRoutingModule
  ],
  declarations: [HabitosPage]
})
export class HabitosPageModule {}