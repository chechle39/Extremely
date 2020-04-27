import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { EntrypatternComponent } from './entrypattern.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { EntrypatternModalComponent } from './entrypattern-modal/entrypattern-modal.component';
import { EntrypatternRoutingModule } from './entrypattern-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { EntryBatternService } from '../_shared/services/entry-pattern.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    EntrypatternComponent,
    EntrypatternModalComponent,
  ],
  imports: [
    CommonModule,
    EntrypatternRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    NgxCleaveDirectiveModule,
    TranslateModule,
  ],
  entryComponents: [EntrypatternModalComponent],
  providers: [CurrencyPipe, DecimalPipe, EntryBatternService, AccountChartService],
})
export class EntrypatternModule { }
