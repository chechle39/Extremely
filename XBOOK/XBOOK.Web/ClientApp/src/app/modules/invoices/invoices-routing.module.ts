import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesComponent } from './invoices.component';
import { extract } from '@core/services/i18n.service';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const routes: Routes = [
  {
    path: '', component: InvoicesComponent, data: { title: extract('Invoices') },
    children: [
      {
        path: '',
        component: ListInvoiceComponent
      },
      {
        path: 'new',
        component: CreateInvoiceComponent
      },
      {
        path: ':id/:key',
        component: CreateInvoiceComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InvoicesRoutingModule { }
