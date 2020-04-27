import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SalesReportoutingModule } from './salesreport-routing.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { SalesReportComponent } from './sales-report.component';
import { DebitAgeService } from '../_shared/services/debitage.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { SalesReportService } from '../_shared/services/salesreport.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { ProductService } from '../_shared/services/product.service';
import { SearchsalesReportComponent } from './searchsales-report/searchsales-report.component';
import { ClientService } from '../_shared/services/client.service';
// tslint:disable-next-line:max-line-length
import { NbPopoverModule, NbSearchModule, NbIconModule, NbAlertModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { CustomDateParserFormatter } from '../../shared/service/datepicker-adapter';
@NgModule({
  declarations: [SalesReportComponent, SearchsalesReportComponent],
  entryComponents: [SearchsalesReportComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    SalesReportoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [CurrencyPipe, DecimalPipe,   {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    ProductService, DebitAgeService, SalesReportComponent, AccountChartService, SalesReportService,
    InvoiceService, ClientService,  SearchsalesReportComponent],
})
export class SalesReportModule { }
