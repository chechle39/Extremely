import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AccountbalanceMRoutingModule } from './accountbalance-routing.module';
import { GenLedService } from '@modules/_shared/services/genled.service';
import { SearchaccountbalanceComponent } from './searchaccountbalance/searchgenled.component';
import { GenledgroupComponent } from '../genledgroup/genledgroup.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { AccountbalanceComponent } from './accountbalance.component';
import { GenLedGroupService } from '@modules/_shared/services/genledgroup.service';
import { AccountBalanceService } from '@modules/_shared/services/accountbalance.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
@NgModule({
  declarations: [AccountbalanceComponent, SearchaccountbalanceComponent],
  entryComponents: [SearchaccountbalanceComponent],
  imports: [
    CommonModule,
    AccountbalanceMRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  providers: [GenLedService, AccountBalanceService, CurrencyPipe, DecimalPipe, GenLedGroupService,  InvoiceService],
})
export class AccountbalanceModule { }
