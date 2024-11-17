import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteraComponent } from './cartera/cartera.component';
import { Cartera } from '../models/Cartera';
import { CarteraCreaEditaComponent } from './cartera/cartera-crea-edita/cartera-crea-edita.component';
import { BancosComponent } from './bancos/bancos.component';
import { BancosCreaEditaComponent } from './bancos/bancos-crea-edita/bancos-crea-edita.component';
import { DeudoresComponent } from './deudores/deudores.component';
import { DeudoresCreaEditaComponent } from './deudores/deudores-crea-edita/deudores-crea-edita.component';
import { CarteraDocumentosListarComponent } from './cartera/cartera-documentos-listar/cartera-documentos-listar.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DocumentosCreaEditaComponent } from './documentos/documentos-crea-edita/documentos-crea-edita.component';
import { UsersComponent } from './users/users.component';
import { UsersCreaEditaComponent } from './users/users-crea-edita/users-crea-edita.component';
import { RoleComponent } from './role/role.component';
import { RoleCreaEditaComponent } from './role/role-crea-edita/role-crea-edita.component';
import { ValorDolarComponent } from './valor-dolar/valor-dolar.component';
import { ValorDolarCreaEditaComponent } from './valor-dolar/valor-dolar-crea-edita/valor-dolar-crea-edita.component';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal.component';
import { SoporteTecnicoComponent } from './soporte-tecnico/soporte-tecnico.component';

const routes: Routes = [
  {
    path: 'pagina-principal',
    component: PaginaPrincipalComponent
  },
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
    path: 'cartera-documentos',
    component: CarteraDocumentosListarComponent
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
  },
  {
    path: 'documentos/:id',
    component: DocumentosComponent,
    children: [
      { path: 'nuevo', component: DocumentosCreaEditaComponent},
      { path: 'editar/:documento_id', component: DocumentosCreaEditaComponent}
    ]
  },
  {
    path: 'usuarios',
    component: UsersComponent,
    children: [
      { path: 'nuevo', component: UsersCreaEditaComponent },
      { path: 'usuarios/:id', component: UsersCreaEditaComponent }
    ]
  },
  {
    path: 'roles',
    component: RoleComponent,
    children: [
      { path: 'nuevo', component: RoleCreaEditaComponent },
      { path: 'roles/:id', component: RoleCreaEditaComponent }
    ]
  },
  {
    path: 'valor-dolar',
    component: ValorDolarComponent,
    children: [
      { path: 'nuevo', component: ValorDolarCreaEditaComponent },
      { path: 'valor-dolar/:id', component: ValorDolarCreaEditaComponent }
    ]
  },
  {
    path: 'soporte-tecnico',
    component: SoporteTecnicoComponent
  }
  // Aquí puedes agregar más rutas al mismo nivel que tasas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
