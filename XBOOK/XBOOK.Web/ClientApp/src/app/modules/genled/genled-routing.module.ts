import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import { GenledComponent } from './genled.component';


const routes: Routes = [
  { path: '', component: GenledComponent, data: { title: extract('Genled') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GenledRoutingModule { }
