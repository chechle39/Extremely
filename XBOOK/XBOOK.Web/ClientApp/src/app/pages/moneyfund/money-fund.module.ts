import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MoneyFundComponentRoutingModule } from './moneyfund-routing.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { MoneyFundComponent } from './money-fund.component';
import { ProductService } from '../_shared/services/product.service';
import { SearchMoneyFundComponent } from './searchmoney-fund/searchmoney-fund.component';
import { ClientService } from '../_shared/services/client.service';
import { NbPopoverModule, NbSearchModule, NbIconModule, NbAlertModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MoneyFundService } from '../_shared/services/moneyfund.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { AuthInterceptor } from '../../coreapp/interceptors/auth.interceptor';
@NgModule({
  declarations: [MoneyFundComponent, SearchMoneyFundComponent],
  entryComponents: [SearchMoneyFundComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    HttpClientModule,
    MoneyFundComponentRoutingModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [CurrencyPipe, DecimalPipe,ProductService,InvoiceService,ClientService,MoneyFundComponent,  MoneyFundService,
       SearchMoneyFundComponent, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
})
export class MoneyFundtModule { }
