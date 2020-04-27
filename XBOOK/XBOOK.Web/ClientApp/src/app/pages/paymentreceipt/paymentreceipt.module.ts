import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AvatarModule } from 'ngx-avatar';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { InvoiceService } from '../_shared/services/invoice.service';
import { PaymentReceiptComponent } from './paymentreceipt.component';
import { CreatePaymentReceiptComponent } from './payment-receipt/payment-receipt.component';
import { PaymentReceiptRoutingModule } from './paymentreceipt-routing.module';
import { PaymentReceiptService } from '../_shared/services/payment-receipt.service';
import { SupplierService } from '../_shared/services/supplier.service';
import {
  NbButtonModule,
  NbCardModule,
  NbPopoverModule,
  NbSearchModule,
  NbIconModule,
  NbAlertModule } from '@nebular/theme';
import { MasterParamService } from '../_shared/services/masterparam.service';
import { CustomDateParserFormatter } from '../../shared/service/datepicker-adapter';

@NgModule({
  declarations: [
    PaymentReceiptComponent,
   // SplitPipe
  ],
  entryComponents: [CreatePaymentReceiptComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    PaymentReceiptRoutingModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    DropDownsModule,
    ReactiveFormsModule,
    InputsModule,
    AvatarModule,
    NgxCleaveDirectiveModule,
    DigitOnlyModule,
  ],
  providers: [SupplierService, MasterParamService, InvoiceService, PaymentReceiptService,
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}],
})
export class PaymentReceiptModule { }
