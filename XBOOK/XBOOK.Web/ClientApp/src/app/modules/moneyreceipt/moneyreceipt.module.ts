import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyreceiptComponent } from './moneyreceipt.component';
import { MoneyReceiptRoutingModule } from './moneyreceipt-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateMoneyReceiptComponent } from './create-money-receipt/create-money-receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ClientService } from '@modules/_shared/services/client.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SplitPipe } from '@shared/pipe/split.pipe';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
    MoneyreceiptComponent,
    CreateMoneyReceiptComponent,
   // SplitPipe
  ],
  entryComponents: [CreateMoneyReceiptComponent],
  imports: [
    CommonModule,
    MoneyReceiptRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    DropDownsModule,
    ReactiveFormsModule,
    InputsModule,
    AvatarModule
  ],
  providers: [ClientService]
})
export class MoneyreceiptModule { }
