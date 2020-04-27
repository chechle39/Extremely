import { NgModule } from '@angular/core';
import { PrintRoutingModule } from './print-routing.module';
import { NbCardModule, NbSelectModule } from '@nebular/theme';
@NgModule({
  imports: [
    PrintRoutingModule,
    NbCardModule,
    NbSelectModule,
  ],
})
export class PrintModule { }
