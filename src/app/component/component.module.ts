import { NgModule } from '@angular/core';
import { ComponentRoutingModule } from './component-routing.module';
import { TasasComponent } from './tasas/tasas.component';
import { TasasCreaEditaComponent } from './tasas/tasas-crea-edita/tasas-crea-edita.component';
import { TasasListarComponent } from './tasas/tasas-listar/tasas-listar.component';

@NgModule({
  imports: [
    ComponentRoutingModule,
    // Mover los componentes a imports en lugar de declarations
    TasasComponent,
    TasasCreaEditaComponent,
    TasasListarComponent
  ]
})
export class ComponentModule { }
