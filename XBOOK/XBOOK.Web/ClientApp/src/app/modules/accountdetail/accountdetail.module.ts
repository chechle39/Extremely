import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AccountDetailroutingModule } from './accountdetail-routing.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { AccountDetailComponent } from './accountdetail.component';

import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { ProductService } from '@modules/_shared/services/product.service';
import { AccountDetailService } from '@modules/_shared/services/accountdetail.service';
import { ClientService } from '@modules/_shared/services/client.service';
import { SearchAccountDetailComponent } from './searchaccount-detail/searchaccount-detail.component';

@NgModule({
  declarations: [AccountDetailComponent, SearchAccountDetailComponent],
  entryComponents: [SearchAccountDetailComponent],
  imports: [
    CommonModule,
    AccountDetailroutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [CurrencyPipe, DecimalPipe, ProductService,  AccountDetailComponent, AccountChartService, AccountDetailService,
    InvoiceService, ClientService, ],
})
export class AcountDetailModule { }
