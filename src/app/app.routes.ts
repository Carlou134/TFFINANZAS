import { Routes } from '@angular/router';
import { TasasComponent } from './component/tasas/tasas.component';
import { TasasCreaEditaComponent } from './component/tasas/tasas-crea-edita/tasas-crea-edita.component';

export const routes: Routes = [
  {
    path: 'tasas', component: TasasComponent, children: [
      { path: 'nuevo', component: TasasCreaEditaComponent}
    ]
  }
];
