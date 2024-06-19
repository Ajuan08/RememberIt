import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'listado',
        loadChildren: () => import('../listado/listado.module').then(m => m.ListadoPageModule)
      },
      {
        path: 'calendario',
        loadChildren: () => import('../calendario/calendario.module').then(m => m.CalendarioPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'medicamento',
        loadChildren: () => import('../medicamento/medicamento.module').then(m => m.MedicamentoPageModule)
      },
      {
        path: 'cita',
        loadChildren: () => import('../cita/cita.module').then(m => m.CitaPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/listado',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/listado',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
