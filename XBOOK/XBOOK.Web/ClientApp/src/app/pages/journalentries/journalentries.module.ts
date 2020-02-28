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
import { InvoiceService } from '../_shared/services/invoice.service';
import { ClientService } from '../_shared/services/client.service';
import { ProductService } from '../_shared/services/product.service';
import { SharedModule } from '../../shared/shared.module';
import { PaymentService } from '../_shared/services/payment.service';
import { TaxService } from '../_shared/services/tax.service';
import { FileUploadModule } from 'primeng/fileupload';
import { CreateMoneyReceiptComponent } from '../moneyreceipt/create-money-receipt/create-money-receipt.component';
import { MoneyReceiptService } from '../_shared/services/money-receipt.service';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { JournalEntriesComponent } from './journalentries.component';
import { ListJournalEntriesComponent } from './list-journalentries/list-journalentries.component';
import { CreateJournalEntriesComponent } from './create-journalentries/create-journalentries.component';
import { JournalEntriesRoutingModule } from './journalentries-routing.module';
import { JournalEntryService } from '../_shared/services/journal-entry.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { NbButtonModule, NbPopoverModule, NbCardModule, NbIconModule, NbSearchModule, NbAlertModule } from '@nebular/theme';

@NgModule({
  declarations: [
    JournalEntriesComponent,
    ListJournalEntriesComponent,
    CreateJournalEntriesComponent],
  imports: [
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    NgxDatatableModule,
    NgbModule,
    JournalEntriesRoutingModule,
    ReactiveFormsModule,
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
    FileUploadModule,
    AutoCompleteModule
  ],
  providers: [
    EntryBatternService,
    MoneyReceiptService,
    InvoiceService,
    ClientService,
    ProductService,
    PaymentService,
    CurrencyPipe,
    NgbActiveModal,
    JournalEntryService,
    AccountChartService,
    TaxService],
  entryComponents: [CreateMoneyReceiptComponent]
})
export class JournalEntriesModule { }
