import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientsComponent } from './clients.component';
import { extract } from '@core/services/i18n.service';


const routes: Routes = [
  { path: '', component: ClientsComponent, data: { title: extract('Clients') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ClientRoutingModule { }
