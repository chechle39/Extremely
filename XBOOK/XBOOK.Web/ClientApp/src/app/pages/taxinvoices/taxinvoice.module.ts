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
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule, NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule } from 'ngx-avatar';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { MoneyReceiptService } from '../_shared/services/money-receipt.service';
import { ClientService } from '../_shared/services/client.service';
import { ProductService } from '../_shared/services/product.service';
import { PaymentService } from '../_shared/services/payment.service';
import { TaxService } from '../_shared/services/tax.service';
import { CreateMoneyReceiptComponent } from '../moneyreceipt/create-money-receipt/create-money-receipt.component';
import { AddTaxComponent } from './create-tax-invoice/add-tax/add-tax.component';
import { MasterParamService } from '../_shared/services/masterparam.service';
import { CustomDateParserFormatter } from '../../shared/service/datepicker-adapter';
import { ListTaxInvoiceComponent } from './list-tax-invoice/list-tax-invoice.component';
import { TaxInvoicesComponent } from './taxinvoice.component';
import { CreateTaxInvoiceComponent } from './create-tax-invoice/create-tax-invoice.component';
import { TaxInvoicesRoutingModule } from './taxinvoice-routing.module';
import { TaxInvoiceService } from '../_shared/services/taxinvoice.service';
import { InvoiceReferenceComponent } from './create-tax-invoice/invoice-reference/invoice-reference.component';
import { InvoiceReferenceService } from '../_shared/services/invoice-reference.service';
import { InvoiceNumberPipe } from './create-tax-invoice/InvoiceNumberPipe.pipe';
const components = [
  TaxInvoicesComponent,
  ListTaxInvoiceComponent,
  CreateTaxInvoiceComponent,
  AddTaxComponent,
  InvoiceNumberPipe,
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
    TaxInvoicesRoutingModule,
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
  entryComponents: [InvoiceReferenceComponent, AddTaxComponent, CreateMoneyReceiptComponent],
  providers: [
    InvoiceReferenceService,
    EntryBatternService ,
    MoneyReceiptService,
    TaxInvoiceService,
    ClientService,
    ProductService,
    PaymentService,
    CurrencyPipe,
    InvoiceNumberPipe,
    MasterParamService,
    NgbActiveModal,
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    TaxService],
})
export class TaxInvoicesModule { }
