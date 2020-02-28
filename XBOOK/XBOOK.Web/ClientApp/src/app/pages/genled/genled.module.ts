import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../_shared/services/client.service';
import { SharedModule } from '../../shared/shared.module';
import { GenledComponent } from './genled.component';
import { GenledRoutingModule } from './genled-routing.module';
import { GenLedService } from '../_shared/services/genled.service';
import { SearchgenledComponent } from './searchgenled/searchgenled.component';
import { AccountChartService } from '../_shared/services/accountchart.service';
import {MultiSelectModule} from 'primeng/multiselect';
import { InvoiceService } from '../_shared/services/invoice.service';
import { AccountBalanceService } from '../_shared/services/accountbalance.service';
import { NbButtonModule, NbCardModule, NbPopoverModule, NbIconModule, NbSearchModule, NbAlertModule } from '@nebular/theme';
@NgModule({
  declarations: [GenledComponent, SearchgenledComponent],
  entryComponents: [SearchgenledComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    GenledRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  providers: [GenLedService, AccountChartService, CurrencyPipe, DecimalPipe, AccountBalanceService, InvoiceService],
})
export class GenledModule { }
