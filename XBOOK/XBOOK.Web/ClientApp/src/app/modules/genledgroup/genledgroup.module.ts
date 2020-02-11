import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { GenledRoutingModule } from './genledgroup-routing.module';
import { GenLedService } from '@modules/_shared/services/genled.service';
import { SearchgenledComponent } from './searchgenledgroup/searchgenled.component';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import {MultiSelectModule} from 'primeng/multiselect';
import { GenledgroupComponent } from './genledgroup.component';
import { GenLedGroupService } from '@modules/_shared/services/genledgroup.service';
import { AccountBalanceService } from '@modules/_shared/services/accountbalance.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
@NgModule({
  declarations: [GenledgroupComponent,
    // SearchgenledComponent
  ],
  entryComponents: [SearchgenledComponent],
  imports: [
    CommonModule,
    GenledRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [GenLedService, AccountChartService, CurrencyPipe, DecimalPipe, GenLedGroupService, AccountBalanceService, InvoiceService],
})
export class GenledGroupModule { }
