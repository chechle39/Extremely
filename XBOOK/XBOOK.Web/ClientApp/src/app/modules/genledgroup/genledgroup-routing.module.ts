import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import { GenledgroupComponent } from './genledgroup.component';


const routes: Routes = [
  { path: '', component: GenledgroupComponent, data: { title: extract('genledgroup') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GenledRoutingModule { }
