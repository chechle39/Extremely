import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { PrintComponent } from './print.component';


const routes: Routes = [
  { path: ':key', component: PrintComponent, data: { title: extract('print') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PrintRoutingModule { }
