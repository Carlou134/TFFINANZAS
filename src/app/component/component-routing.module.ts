import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteraComponent } from './cartera/cartera.component';
import { Cartera } from '../models/Cartera';
import { CarteraCreaEditaComponent } from './cartera/cartera-crea-edita/cartera-crea-edita.component';
import { BancosComponent } from './bancos/bancos.component';
import { BancosCreaEditaComponent } from './bancos/bancos-crea-edita/bancos-crea-edita.component';
import { DeudoresComponent } from './deudores/deudores.component';
import { DeudoresCreaEditaComponent } from './deudores/deudores-crea-edita/deudores-crea-edita.component';

const routes: Routes = [
  {
    path: 'cartera',
    component: CarteraComponent,
    children: [
      { path: 'nuevo', component: CarteraCreaEditaComponent },
      { path: 'cartera/:id', component: CarteraCreaEditaComponent },
      // Aquí puedes agregar más rutas hijas si las necesitas
    ]
  },
  {
    path: 'bancos',
    component: BancosComponent,
    children: [
      { path: 'nuevo', component: BancosCreaEditaComponent },
      { path: 'bancos/:id', component: BancosCreaEditaComponent },
      // Aquí puedes agregar más rutas hijas si las necesitas
    ]
  },
  {
    path: 'deudores',
    component: DeudoresComponent,
    children: [
      { path: 'nuevo', component: DeudoresCreaEditaComponent },
      { path: 'deudores/:id', component: DeudoresCreaEditaComponent },
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
