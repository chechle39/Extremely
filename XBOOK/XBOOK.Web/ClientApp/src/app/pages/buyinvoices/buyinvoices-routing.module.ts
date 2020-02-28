import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyInvoicesComponent } from './buyinvoices.component';
import { ListBuyInvoiceComponent } from './list-buyinvoice/list-buyinvoice.component';
import { CreateBuyInvoiceComponent } from './create-buy-invoice/create-buy-invoice.component';

const routes: Routes = [{
  path: '',
  component: BuyInvoicesComponent,
  children: [ {
    path: '',
    component: ListBuyInvoiceComponent,
  }, {
    path: 'new',
    component: CreateBuyInvoiceComponent,
  },
  {
    path: ':id/:key',
    component: CreateBuyInvoiceComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyInvoicesRoutingModule { }
