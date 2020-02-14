import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MasterParamComponent } from './masterparam.component';
import { extract } from '@core/services/i18n.service';


const routes: Routes = [
  { path: '', component: MasterParamComponent, data: { title: extract('masterParam') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MasterParamRoutingModule { }
