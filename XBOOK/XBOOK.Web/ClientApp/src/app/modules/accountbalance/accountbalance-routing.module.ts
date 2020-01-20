import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountbalanceComponent } from './accountbalance.component';
import { extract } from '@core/services/i18n.service';


const routes: Routes = [
  { path: '', component: AccountbalanceComponent, data: { title: extract('accountbalance') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AccountbalanceMRoutingModule { }
