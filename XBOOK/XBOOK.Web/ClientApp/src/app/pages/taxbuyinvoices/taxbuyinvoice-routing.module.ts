import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxBuyInvoicesComponent } from './taxbuyinvoice.component';
import { CreateTaxBuyInvoiceComponent } from './create-tax-buyinvoice/create-tax-buyinvoice.component';
import { ListTaxBuyInvoiceComponent } from './list-tax-buyinvoice/list-tax-buyinvoice.component';

const routes: Routes = [{
  path: '',
  component: TaxBuyInvoicesComponent,
  children: [ {
    path: '',
    component: ListTaxBuyInvoiceComponent,
  }, {
    path: 'new',
    component: CreateTaxBuyInvoiceComponent,
  },
  {
    path: ':id/:key',
    component: CreateTaxBuyInvoiceComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxBuyInvoicesRoutingModule { }
