import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '../_shared/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserService } from '../_shared/services/user.service';
import { RoleService } from '../_shared/services/role.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  NbButtonModule,
  NbPopoverModule,
  NbAlertModule,
  NbIconModule,
  NbSearchModule,
  NbCardModule } from '@nebular/theme';

@NgModule({
  declarations: [UserComponent, CreateUserComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    UserRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
    RadioButtonModule,
  ],
  providers: [UserService, RoleService],
  entryComponents: [CreateUserComponent],
})
export class UserModule { }

