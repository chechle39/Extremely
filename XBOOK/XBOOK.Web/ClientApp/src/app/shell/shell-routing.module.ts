import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell.component';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { extract } from '../core/services/i18n.service';
import { AuthenticationGuard } from '@core/auth/authentication.guard';
import { PrintComponent } from '@modules/print/print.component';
const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
  //  canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent, data: { title: extract('Dashboard') } },
      { path: 'print/:key', component: PrintComponent, data: { title: extract('print') } },
     // { path: 'id/:key', component: GenledgroupComponent, data: { title: extract('genledgroup') } },
      {
        path: 'client',
        loadChildren: () => import('../modules/clients/clients.module')
          .then(m => m.ClientsModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../modules/products/products.module')
          .then(m => m.ProductsModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('../modules/invoices/invoices.module')
          .then(m => m.InvoicesModule)
      },
      {
        path: 'invoice/:key',
        loadChildren: () => import('../modules/invoices/invoices.module')
          .then(m => m.InvoicesModule)
      },
      {
        path: 'generalentry',
        loadChildren: () => import('../modules/genled/genled.module')
          .then(m => m.GenledModule)
      },
      {
        path: 'genledgroup/:key',
        loadChildren: () => import('../modules/genledgroup/genledgroup.module')
          .then(m => m.GenledGroupModule)
      },
      {
        path: 'genledgroup',
        loadChildren: () => import('../modules/genledgroup/genledgroup.module')
          .then(m => m.GenledGroupModule)
      },
      {
        path: 'accountbalance',
        loadChildren: () => import('../modules/accountbalance/accountbalance.module')
          .then(m => m.AccountbalanceModule)
      },
      {
        path: 'debitage',
        loadChildren: () => import('../modules/debitage/debit-age.module')
          .then(m => m.DebitAgeModule)
      },
      {
        path: 'salesreport',
        loadChildren: () => import('../modules/salesreport/sales-report.module')
          .then(m => m.SalesReportModule)
      },

      {
        path: 'purchasereport',
        loadChildren: () => import('../modules/purchasereport/purchase-report.module')
          .then(m => m.PurchaseReportModule)
      },
      {
        path: 'moneyreceipt',
        loadChildren: () => import('../modules/moneyreceipt/moneyreceipt.module')
          .then(m => m.MoneyreceiptModule)
      },
      {
        path: 'buyinvoice',
        loadChildren: () => import('../modules/buyinvoices/buyinvoices.module')
          .then(m => m.BuyInvoicesModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('../modules/supplier/supplier.module')
          .then(m => m.SupplierModule)
      },
      {
        path: 'paymentreceipt',
        loadChildren: () => import('../modules/paymentreceipt/paymentreceipt.module')
          .then(m => m.PaymentReceiptModule)
      },
      {
        path: 'acountdetail',
        loadChildren: () => import('../modules/accountdetail/accountdetail.module')
          .then(m => m.AcountDetailModule)
      },
      {
        path: 'acountchart',
        loadChildren: () => import('../modules/accountchart/accountchart.module')
          .then(m => m.AccountChartModule)
      },
      {
        path: 'masterParam',
        loadChildren: () => import('../modules/masterparam/masterparam.module')
          .then(m => m.MasterParamModule)
      },
      {
        path: 'companyProfile',
        loadChildren: () => import('../modules/companyprofile/companyprofile.module')
          .then(m => m.CompanyProfileModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../modules/user/user.module')
          .then(m => m.UserModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {
  static components = [ShellComponent];
}

