import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { MoneyreceiptComponent } from './moneyreceipt.component';


const routes: Routes = [
  { path: '', component: MoneyreceiptComponent, data: { title: extract('moneyreceipt') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MoneyReceiptRoutingModule { }
