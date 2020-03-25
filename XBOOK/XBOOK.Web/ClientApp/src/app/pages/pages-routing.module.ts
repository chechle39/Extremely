import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthenticationGuard } from '../coreapp/auth/authentication.guard';
import { extract } from '../coreapp/services/i18n.service';

const routes: Routes = [
  {
  path: '',
  component: PagesComponent,
  canActivate: [AuthenticationGuard],
  children: [
    // { path: 'print/:key', component: PrintComponent, data: { title: extract('print') } },
    {
      path: 'invoice',
      loadChildren: () => import('./invoices/invoice.module')
        .then(m => m.InvoicesModule),
    },
    {
      path: 'print',
      loadChildren: () => import('./print/print.module')
        .then(m => m.PrintModule),
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
    {
      path: 'debitage',
      loadChildren: () => import('./debitage/debit-age.module')
        .then(m => m.DebitAgeModule),
    },
    {
      path: 'acountdetail',
      loadChildren: () => import('./accountdetail/accountdetail.module')
        .then(m => m.AcountDetailModule),
    },
    {
      path: 'user',
      loadChildren: () => import('./user/user.module')
        .then(m => m.UserModule),
    },
    // {
    //   path: 'role',
    //   loadChildren: () => import('./role/role.module')
    //     .then(m => m.RoleModule),
    // },
    {
      path: 'accountbalance',
      loadChildren: () => import('./accountbalance/accountbalance.module')
        .then(m => m.AccountbalanceModule),
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
