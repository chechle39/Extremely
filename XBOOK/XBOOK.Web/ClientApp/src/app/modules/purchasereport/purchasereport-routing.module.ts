import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import {PurchaseReportComponent} from './purchase-report.component';


const routes: Routes = [
  { path: '', component: PurchaseReportComponent, data: { title: extract('purchasereport') }},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PurchaseReportoutingModule { }
