import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'habitos',
        loadChildren: () =>
          import('../habitos/habitos.module').then(m => m.HabitosPageModule),
      },
      {
        path: 'progreso',
        loadChildren: () =>
          import('../progreso/progreso.module').then(m => m.ProgresoPageModule),
      },
      {
        path: 'mascota',
        loadChildren: () =>
          import('../mascota/mascota.module').then(m => m.MascotaPageModule),
      },
      {
        path: 'extras',
        loadChildren: () =>
          import('../extras/extras.module').then(m => m.ExtrasPageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

