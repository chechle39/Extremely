import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { validateNullDirective } from './validate/validatenull';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../pages/_shared/services/user.service';
import { RegisterComponent } from './register/register.component';
import { XBookAuthenComponent } from './xbook-authen.component';
import { XBookAuthenRoutingModule } from './xbook-authen-routing.module';
import { NbLayoutModule, NbSpinnerModule, NbButtonModule, NbAlertModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NbAuthModule } from '@nebular/auth';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AuthenLayoutComponent } from './authen-layout/authen-layout.component';

const components = [
  XBookAuthenComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ForgotPasswordComponent,
  LoginComponent,
  validateNullDirective,
  ConfirmEmailComponent,
  AuthenLayoutComponent,
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    XBookAuthenRoutingModule,
    FormsModule,
    SharedModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbButtonModule,
    NbAlertModule,
    NbCardModule,
    NbAuthModule,
    NbIconModule,
  ],
  declarations: [
    ...components,
  ],
  providers: [UserService],
})
export class XBookAuthenModule { }
