import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteraComponent } from './cartera/cartera.component';
import { Cartera } from '../models/Cartera';
import { CarteraCreaEditaComponent } from './cartera/cartera-crea-edita/cartera-crea-edita.component';

const routes: Routes = [
  {
    path: 'cartera',
    component: CarteraComponent,
    children: [
      { path: 'nuevo', component: CarteraCreaEditaComponent },
      { path: 'tasas/:id', component: CarteraCreaEditaComponent },
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
