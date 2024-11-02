import { NgModule } from '@angular/core';
import { ComponentRoutingModule } from './component-routing.module';


@NgModule({
  imports: [
    ComponentRoutingModule,
    // Mover los componentes a imports en lugar de declarations
  ]
})
export class ComponentModule { }
