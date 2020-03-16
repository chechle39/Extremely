import { NgModule } from '@angular/core';
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
import {FileUploadModule} from 'primeng/fileupload';
import { BuyInvoicesComponent } from './buyinvoices.component';
import { ListBuyInvoiceComponent } from './list-buyinvoice/list-buyinvoice.component';
import { BuyInvoicesRoutingModule } from './buyinvoices-routing.module';
import { CreateBuyInvoiceComponent } from './create-buy-invoice/create-buy-invoice.component';
import { AddTaxComponent } from './create-buy-invoice/add-tax/add-tax.component';
import { AddPayment2Component } from './create-buy-invoice/payment/add-payment/add-payment.component';
import { ListPayment2Component } from './create-buy-invoice/payment/list-payment/list-payment.component';
import { PaymentReceiptService } from '../_shared/services/payment-receipt.service';
import { BuyInvoiceService } from '../_shared/services/buy-invoice.service';
import { SharedModule } from '../../shared/shared.module';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { MoneyReceiptService } from '../_shared/services/money-receipt.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { SupplierService } from '../_shared/services/supplier.service';
import { ProductService } from '../_shared/services/product.service';
import { Payment2Service } from '../_shared/services/payment2.service';
import { TaxService } from '../_shared/services/tax.service';
import { CreateMoneyReceiptComponent } from '../moneyreceipt/create-money-receipt/create-money-receipt.component';
import { CreatePaymentReceiptComponent } from '../paymentreceipt/payment-receipt/payment-receipt.component';
import {
  NbAlertModule,
  NbCardModule,
   NbIconModule,
   NbPopoverModule,
   NbSearchModule,
   NbButtonModule,
   NbActionsModule} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { MasterParamService } from '../_shared/services/masterparam.service';

const components = [
  BuyInvoicesComponent,
    ListBuyInvoiceComponent,
    CreateBuyInvoiceComponent,
    AddPayment2Component,
    AddTaxComponent,
    ListPayment2Component,
];
@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    ThemeModule,
    BuyInvoicesRoutingModule,
    NbActionsModule,
    NgxDatatableModule,
    SharedModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropDownsModule,
    AvatarModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    IntlModule,
    InputsModule,
    DateInputsModule,
  ],
  providers: [
    PaymentReceiptService,
    BuyInvoiceService,
    EntryBatternService ,
    MoneyReceiptService,
    InvoiceService,
    SupplierService,
    ProductService,
    Payment2Service,
    CurrencyPipe,
    NgbActiveModal,
    MasterParamService,
    TaxService],
  entryComponents: [
    AddPayment2Component,
    AddTaxComponent,
    CreateMoneyReceiptComponent,
    CreatePaymentReceiptComponent,
  ],
})
export class BuyInvoicesModule { }
