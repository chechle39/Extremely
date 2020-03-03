import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '../_shared/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '../../shared/shared.module';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
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
  NbCardModule,
  NbCheckboxModule} from '@nebular/theme';

@NgModule({
  declarations: [RoleComponent, CreateRoleComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    RoleRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
    RadioButtonModule,
    NbCheckboxModule,
  ],
  providers: [ProductService, UserService, RoleService],
  entryComponents: [CreateRoleComponent],
})
export class RoleModule { }

