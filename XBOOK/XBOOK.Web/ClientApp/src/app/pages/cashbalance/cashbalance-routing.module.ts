import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { MoneyFundComponent } from './cash-balance.component';
const routes: Routes = [
  { path: '', component: MoneyFundComponent, data: { title: extract('Cashbalance') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MoneyFundComponentRoutingModule { static components = [MoneyFundComponent]; }
