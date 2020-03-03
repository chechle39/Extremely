import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { UserComponent } from './user.component';
const routes: Routes = [
  { path: '', component: UserComponent, data: { title: extract('User') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule { static components = [UserComponent]; }
