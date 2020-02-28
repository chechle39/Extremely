import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicesComponent } from './invoice.component';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const routes: Routes = [{
  path: '',
  component: InvoicesComponent,
  children: [ {
    path: '',
    component: ListInvoiceComponent,
  }, {
    path: 'new',
    component: CreateInvoiceComponent,
  },
  {
    path: ':id/:key',
    component: CreateInvoiceComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule { }
