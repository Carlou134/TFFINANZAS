import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasasComponent } from './tasas/tasas.component';
import { TasasCreaEditaComponent } from './tasas/tasas-crea-edita/tasas-crea-edita.component';

const routes: Routes = [
  {
    path: 'tasas',
    component: TasasComponent,
    children: [
      { path: 'nuevo', component: TasasCreaEditaComponent },
      // Aquí puedes agregar más rutas hijas si las necesitas
    ]
  }
  // Aquí puedes agregar más rutas al mismo nivel que tasas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
