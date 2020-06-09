import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxInvoicesComponent } from './taxinvoice.component';
import { ListTaxInvoiceComponent } from './list-tax-invoice/list-tax-invoice.component';
import { CreateTaxInvoiceComponent } from './create-tax-invoice/create-tax-invoice.component';
const routes: Routes = [{
  path: '',
  component: TaxInvoicesComponent,
  children: [ {
    path: '',
    component: ListTaxInvoiceComponent,
  }, {
    path: 'new',
    component: CreateTaxInvoiceComponent,
  },
  {
    path: ':id/:key',
    component: CreateTaxInvoiceComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxInvoicesRoutingModule { }
