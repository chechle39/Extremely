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
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent, data: { title: extract('Dashboard') } },
      { path: 'print/:key', component: PrintComponent, data: { title: extract('print') } },
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
        path: 'generalentry',
        loadChildren: () => import('../modules/genled/genled.module')
          .then(m => m.GenledModule)
      },
      {
        path: 'genledgroup',
        loadChildren: () => import('../modules/genledgroup/genledgroup.module')
          .then(m => m.GenledGroupModule)
      },
      {
        path: 'moneyreceipt',
        loadChildren: () => import('../modules/moneyreceipt/moneyreceipt.module')
          .then(m => m.MoneyreceiptModule)
      }
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

