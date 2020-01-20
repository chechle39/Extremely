import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import {SalesReportComponent} from './sales-report.component';


const routes: Routes = [
  { path: '', component: SalesReportComponent, data: { title: extract('salesreport') }},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SalesReportoutingModule { }
