import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { RoleComponent } from './role.component';
const routes: Routes = [
  { path: '', component: RoleComponent, data: { title: extract('Role') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RoleRoutingModule { static components = [RoleComponent]; }
