import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DebitAgeRoutingModule } from './debitage-routing.module';
import { SearchDebitAgeComponent } from './searchdebit-age/searchdebit-age.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { DebitAgeComponent } from './debit-age.component';
import { DebitAgeService } from '@modules/_shared/services/debitage.service';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
@NgModule({
  declarations: [DebitAgeComponent, SearchDebitAgeComponent],
  entryComponents: [SearchDebitAgeComponent],
  imports: [
    CommonModule,
    DebitAgeRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [CurrencyPipe, DecimalPipe, DebitAgeService, SearchDebitAgeComponent, AccountChartService, InvoiceService],
})
export class DebitAgeModule { }
