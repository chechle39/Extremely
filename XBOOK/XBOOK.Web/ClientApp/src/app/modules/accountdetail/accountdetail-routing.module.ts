import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import {AccountDetailComponent} from './accountdetail.component';


const routes: Routes = [
  { path: '', component: AccountDetailComponent, data: { title: extract('acountdetail') }},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AccountDetailroutingModule { }
