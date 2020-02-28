import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { DebitAgeComponent } from './debit-age.component';


const routes: Routes = [
  { path: '', component: DebitAgeComponent, data: { title: extract('debitage') }},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DebitAgeRoutingModule { }
