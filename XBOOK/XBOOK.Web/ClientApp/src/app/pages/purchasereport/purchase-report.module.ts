import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PurchaseReportoutingModule } from './purchasereport-routing.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { PurchaseReportComponent } from './purchase-report.component';
import { DebitAgeService } from '../_shared/services/debitage.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { PurchaseReportService } from '../_shared/services/purchasereport.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { ProductService } from '../_shared/services/product.service';
import { SearchPurchaseReportComponent } from './searchpurchase-report/searchpurchase-report.component';
import { SupplierService } from '../_shared/services/supplier.service';
import { NbCardModule, NbButtonModule, NbPopoverModule, NbIconModule, NbAlertModule, NbSearchModule } from '@nebular/theme';
@NgModule({
  declarations: [PurchaseReportComponent, SearchPurchaseReportComponent],
  entryComponents: [SearchPurchaseReportComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    PurchaseReportoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  providers: [CurrencyPipe, DecimalPipe, ProductService, DebitAgeService, PurchaseReportComponent, AccountChartService,
    PurchaseReportService,
    InvoiceService, SupplierService,  SearchPurchaseReportComponent],
})
export class PurchaseReportModule { }
