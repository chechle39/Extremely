import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyProfileComponent } from './companyprofile.component';
import { extract } from '@core/services/i18n.service';


const routes: Routes = [
  { path: '', component: CompanyProfileComponent, data: { title: extract('companyProfile') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CompanyProfileRoutingModule { }
