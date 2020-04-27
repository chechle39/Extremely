import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyreceiptComponent } from './moneyreceipt.component';
import { MoneyReceiptRoutingModule } from './moneyreceipt-routing.module';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateMoneyReceiptComponent } from './create-money-receipt/create-money-receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ClientService } from '../_shared/services/client.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AvatarModule } from 'ngx-avatar';
import { MoneyReceiptService } from '../_shared/services/money-receipt.service';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { InvoiceService } from '../_shared/services/invoice.service';
import {
  NbCardModule,
  NbButtonModule,
  NbSearchModule,
  NbPopoverModule,
  NbIconModule,
  NbAlertModule } from '@nebular/theme';
import { MasterParamService } from '../_shared/services/masterparam.service';
import { CustomDateParserFormatter } from '../../shared/service/datepicker-adapter';

@NgModule({
  declarations: [
    MoneyreceiptComponent,
    // SplitPipe
  ],
  entryComponents: [CreateMoneyReceiptComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    MoneyReceiptRoutingModule,
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
  providers: [ClientService, MoneyReceiptService, EntryBatternService, InvoiceService, MasterParamService,
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}],
})
export class MoneyreceiptModule { }
