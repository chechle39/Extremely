import { NgModule } from '@angular/core';
import {
  NbAlertModule,
  NbCardModule,
   NbIconModule,
   NbPopoverModule,
   NbSearchModule,
   NbButtonModule,
   NbActionsModule} from '@nebular/theme';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ThemeModule } from '../../@theme/theme.module';
import { InvoicesRoutingModule } from './invoice-routing.module';
import { InvoicesComponent } from './invoice.component';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule } from 'ngx-avatar';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { MoneyReceiptService } from '../_shared/services/money-receipt.service';
import { InvoiceService } from '../_shared/services/invoice.service';
import { ClientService } from '../_shared/services/client.service';
import { ProductService } from '../_shared/services/product.service';
import { PaymentService } from '../_shared/services/payment.service';
import { TaxService } from '../_shared/services/tax.service';
import { AddPaymentComponent } from './create-invoice/payment/add-payment/add-payment.component';
import { ListPaymentComponent } from './create-invoice/payment/list-payment/list-payment.component';
import { CreateMoneyReceiptComponent } from '../moneyreceipt/create-money-receipt/create-money-receipt.component';
import { AddTaxComponent } from './create-invoice/add-tax/add-tax.component';
const components = [
  InvoicesComponent,
  ListInvoiceComponent,
  CreateInvoiceComponent,
  AddPaymentComponent,
  ListPaymentComponent,
  AddTaxComponent,
];

@NgModule({
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    ThemeModule,
    InvoicesRoutingModule,
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
  declarations: [
    ...components,
  ],
  entryComponents: [AddPaymentComponent, AddTaxComponent, CreateMoneyReceiptComponent],
  providers: [
    EntryBatternService ,
    MoneyReceiptService,
    InvoiceService,
    ClientService,
    ProductService,
    PaymentService,
    CurrencyPipe,
    NgbActiveModal,
    TaxService],
})
export class InvoicesModule { }
