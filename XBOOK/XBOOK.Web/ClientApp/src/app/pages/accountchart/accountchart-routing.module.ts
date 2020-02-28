import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { AccountChartComponent } from './accountchart.component';
const routes: Routes = [
  { path: '', component: AccountChartComponent, data: { title: extract('AccountChart') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AccountChartRoutingModule { static components = [AccountChartComponent]; }
