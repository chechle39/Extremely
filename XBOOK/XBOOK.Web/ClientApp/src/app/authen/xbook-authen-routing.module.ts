import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthenLayoutComponent } from './authen-layout/authen-layout.component';
const routes: Routes = [
 {
    path: 'login',
    component: AuthenLayoutComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  // {
  //   path: 'forgot',
  //   component: ForgotPasswordComponent,
  // },
  // {
  //   path: 'reset-password',
  //   component: ResetPasswordComponent,
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class XBookAuthenRoutingModule { }
