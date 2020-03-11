import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '../../shared/shared.module';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
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
import { AssignPermissionComponent } from './assign-permission/assign-permission.component';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { MenuService } from '../_shared/services/menu.service';

@NgModule({
  declarations: [RoleComponent, CreateRoleComponent, AssignPermissionComponent],
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
  providers: [RoleService, AccountChartService, MenuService],
  entryComponents: [CreateRoleComponent, AssignPermissionComponent],
})
export class RoleModule { }

