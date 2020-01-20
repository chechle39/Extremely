import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { ProductService } from '@modules/_shared/services/product.service';
import { SharedModule } from '@shared/shared.module';
import { PaymentService } from '@modules/_shared/services/payment.service';
import { TaxService } from '@modules/_shared/services/tax.service';
import {FileUploadModule} from 'primeng/fileupload';
import { CreateMoneyReceiptComponent } from '@modules/moneyreceipt/create-money-receipt/create-money-receipt.component';
import { MoneyReceiptService } from '@modules/_shared/services/money-receipt.service';
import { EntryBatternService } from '@modules/_shared/services/entry-pattern.service';
import { BuyInvoicesComponent } from './buyinvoices.component';
import { ListBuyInvoiceComponent } from './list-buyinvoice/list-buyinvoice.component';
import { BuyInvoicesRoutingModule } from './buyinvoices-routing.module';
import { BuyInvoiceService } from '@modules/_shared/services/buy-invoice.service';
import { CreateBuyInvoiceComponent } from './create-buy-invoice/create-buy-invoice.component';
import { SupplierService } from '@modules/_shared/services/supplier.service';
import { AddTaxComponent } from './create-buy-invoice/add-tax/add-tax.component';
import { Payment2Service } from '@modules/_shared/services/payment2.service';
import { AddPayment2Component } from './create-buy-invoice/payment/add-payment/add-payment.component';
import { ListPayment2Component } from './create-buy-invoice/payment/list-payment/list-payment.component';
import { ClientService } from '@modules/_shared/services/client.service';
import { CreatePaymentReceiptComponent } from '@modules/paymentreceipt/payment-receipt/payment-receipt.component';
import { PaymentReceiptService } from '@modules/_shared/services/payment-receipt.service';
@NgModule({
  declarations: [
    BuyInvoicesComponent,
    ListBuyInvoiceComponent,
    CreateBuyInvoiceComponent,
    AddPayment2Component,
    AddTaxComponent,
    ListPayment2Component,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NgbModule,
    BuyInvoicesRoutingModule,
    ReactiveFormsModule,
    // GridModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    HttpClientModule,
    AvatarModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    IntlModule,
    SharedModule,
    FileUploadModule
  ],
  providers: [
    PaymentReceiptService,
    ClientService,
    BuyInvoiceService,
    EntryBatternService ,
    MoneyReceiptService,
    InvoiceService,
    SupplierService,
    ProductService,
    Payment2Service,
    CurrencyPipe,
    NgbActiveModal,
    TaxService],
  entryComponents: [AddPayment2Component, AddTaxComponent, CreateMoneyReceiptComponent, CreatePaymentReceiptComponent]
})
export class BuyInvoicesModule { }
