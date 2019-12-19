import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SplitPipe } from '@shared/pipe/split.pipe';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { ClientService } from '@modules/_shared/services/client.service';
import { ProductService } from '@modules/_shared/services/product.service';
import { SharedModule } from '@shared/shared.module';

import { ListPaymentComponent } from './create-invoice/payment/list-payment/list-payment.component';
import { AddPaymentComponent } from './create-invoice/payment/add-payment/add-payment.component';
import { PaymentService } from '@modules/_shared/services/payment.service';
import { AddTaxComponent } from './create-invoice/add-tax/add-tax.component';
import { TaxService } from '@modules/_shared/services/tax.service';
import { validateDirective } from './create-invoice/payment/add-payment/validate';
import {FileUploadModule} from 'primeng/fileupload';
import { ChangeNameDirective } from './create-invoice/changename';
@NgModule({
  declarations: [
    InvoicesComponent,
    ListInvoiceComponent,
    CreateInvoiceComponent,
    SplitPipe,
    AddPaymentComponent,
    ListPaymentComponent,
    ChangeNameDirective,
    validateDirective,
    AddTaxComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NgbModule,
    InvoicesRoutingModule,
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
  providers: [InvoiceService, ClientService, ProductService, PaymentService, CurrencyPipe, NgbActiveModal, TaxService],
  entryComponents: [AddPaymentComponent, AddTaxComponent]
})
export class InvoicesModule { }
