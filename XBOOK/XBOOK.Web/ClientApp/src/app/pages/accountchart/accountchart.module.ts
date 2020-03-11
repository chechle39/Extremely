import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '../_shared/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '../../shared/shared.module';
import { AccountChartComponent } from './accountchart.component';
import { AccountChartRoutingModule } from './accountchart-routing.module';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { CreateAccountChartComponent } from './create-accountchart/create-accountchart.component';
import { SearchgenledComponent } from '../genledgroup/searchgenledgroup/searchgenled.component';
import {
  NbPopoverModule,
  NbSearchModule,
  NbIconModule,
  NbAlertModule,
  NbCardModule,
  NbButtonModule } from '@nebular/theme';
@NgModule({
  declarations: [AccountChartComponent, CreateAccountChartComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    AccountChartRoutingModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [AccountChartService],
  entryComponents: [CreateAccountChartComponent, SearchgenledComponent]
})
export class AccountChartModule { }

