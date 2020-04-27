import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountDetailroutingModule } from './accountdetail-routing.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { AccountDetailComponent } from './accountdetail.component';

import { AccountChartService } from '../_shared/services/accountchart.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { ProductService } from '../_shared/services/product.service';
import { AccountDetailService } from '../_shared/services/accountdetail.service';
import { ClientService } from '../_shared/services/client.service';
import { SearchAccountDetailComponent } from './searchaccount-detail/searchaccount-detail.component';
// tslint:disable-next-line:max-line-length
import { NbAlertModule, NbIconModule, NbSearchModule, NbCardModule, NbPopoverModule, NbButtonModule } from '@nebular/theme';
import { CustomDateParserFormatter } from '../../shared/service/datepicker-adapter';

@NgModule({
  declarations: [AccountDetailComponent, SearchAccountDetailComponent],
  entryComponents: [SearchAccountDetailComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    AccountDetailroutingModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [CurrencyPipe, DecimalPipe, ProductService,  AccountDetailComponent, AccountChartService,
    AccountDetailService,
    InvoiceService, ClientService,  {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter} ],
})
export class AcountDetailModule { }
