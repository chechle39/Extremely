import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AvatarModule } from 'ngx-avatar';
import { EntryBatternService } from '@modules/_shared/services/entry-pattern.service';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { PaymentReceiptComponent } from './paymentreceipt.component';
import { CreatePaymentReceiptComponent } from './payment-receipt/payment-receipt.component';
import { PaymentReceiptRoutingModule } from './paymentreceipt-routing.module';
import { PaymentReceiptService } from '@modules/_shared/services/payment-receipt.service';
import { SupplierService } from '@modules/_shared/services/supplier.service';

@NgModule({
  declarations: [
    PaymentReceiptComponent,
   // CreatePaymentReceiptComponent,
   // SplitPipe
  ],
  entryComponents: [CreatePaymentReceiptComponent],
  imports: [
    CommonModule,
    PaymentReceiptRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    DropDownsModule,
    ReactiveFormsModule,
    InputsModule,
    AvatarModule,
    NgxCleaveDirectiveModule,
    DigitOnlyModule
  ],
  providers: [SupplierService, EntryBatternService, InvoiceService, PaymentReceiptService]
})
export class PaymentReceiptModule { }
