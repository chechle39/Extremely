import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PrintComponent } from './print/print.component';
import { extract } from '../coreapp/services/i18n.service';

const routes: Routes = [
  {
  path: '',
  component: PagesComponent,
  children: [
    { path: 'print/:key', component: PrintComponent, data: { title: extract('print') } },
    {
      path: 'invoice',
      loadChildren: () => import('./invoices/invoice.module')
        .then(m => m.InvoicesModule),
    },
    {
      path: 'clients',
      loadChildren: () => import('./clients/clients.module')
        .then(m => m.ClientsModule),
    },
    {
      path: 'supplier',
      loadChildren: () => import('./supplier/supplier.module')
        .then(m => m.SupplierModule),
    },
    {
      path: 'moneyreceipt',
      loadChildren: () => import('./moneyreceipt/moneyreceipt.module')
        .then(m => m.MoneyreceiptModule),
    },
    {
      path: 'paymentreceipt',
      loadChildren: () => import('./paymentreceipt/paymentreceipt.module')
        .then(m => m.PaymentReceiptModule),
    },
    {
      path: 'generalentry',
      loadChildren: () => import('./genled/genled.module')
        .then(m => m.GenledModule),
    },
    {
      path: 'genledgroup/:key',
      loadChildren: () => import('./genledgroup/genledgroup.module')
        .then(m => m.GenledGroupModule),
    },
    {
      path: 'genledgroup',
      loadChildren: () => import('./genledgroup/genledgroup.module')
        .then(m => m.GenledGroupModule),
    },
    {
      path: 'accountchart',
      loadChildren: () => import('./accountchart/accountchart.module')
        .then(m => m.AccountChartModule),
    },
    {
      path: 'product',
      loadChildren: () => import('./products/products.module')
        .then(m => m.ProductsModule),
    },
    {
      path: 'masterParam',
      loadChildren: () => import('./masterparam/masterparam.module')
        .then(m => m.MasterParamModule),
    },
    {
      path: 'journalentries',
      loadChildren: () => import('./journalentries/journalentries.module')
        .then(m => m.JournalEntriesModule),
    },
    {
      path: 'purchasereport',
      loadChildren: () => import('./purchasereport/purchase-report.module')
        .then(m => m.PurchaseReportModule),
    },
    {
      path: 'buyinvoice',
      loadChildren: () => import('./buyinvoices/buyinvoices.module')
        .then(m => m.BuyInvoicesModule),
    },
    {
      path: 'companyProfile',
      loadChildren: () => import('./companyprofile/companyprofile.module')
        .then(m => m.CompanyProfileModule),
    },
    {
      path: 'salesreport',
      loadChildren: () => import('./salesreport/sales-report.module')
        .then(m => m.SalesReportModule),
    },
    {
      path: 'debitage',
      loadChildren: () => import('./debitage/debit-age.module')
        .then(m => m.DebitAgeModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
