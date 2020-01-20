import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import { SupplierComponent } from './supplier.component';


const routes: Routes = [
  { path: '', component: SupplierComponent, data: { title: extract('suppler') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SupplierRoutingModule { }
