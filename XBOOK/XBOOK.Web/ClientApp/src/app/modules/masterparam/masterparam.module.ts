import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MasterParamRoutingModule } from './masterparam-routing.module';
import { MasterParamComponent } from './masterparam.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MasterParamService } from '@modules/_shared/services/masterparam.service';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateMasterParamComponent } from './create-masterparam/create-masterparam.component';
@NgModule({
  declarations: [MasterParamComponent, CreateMasterParamComponent],
  imports: [
    CommonModule,
    MasterParamRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule
  ],
  providers: [MasterParamComponent, MasterParamService, CurrencyPipe, DecimalPipe, CompanyService],
  entryComponents: [CreateMasterParamComponent]
})
export class MasterParamModule { }
