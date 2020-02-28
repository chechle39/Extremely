import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { ProductsComponent } from './products.component';
const routes: Routes = [
  { path: '', component: ProductsComponent, data: { title: extract('Products') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProductsRoutingModule { static components = [ProductsComponent]; }
