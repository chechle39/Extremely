import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '@modules/_shared/services/product.service';
import { FormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '@shared/shared.module';
import { AccountChartComponent } from './accountchart.component';
import { AccountChartRoutingModule } from './accountchart-routing.module';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import { CreateAccountChartComponent } from './create-accountchart/create-accountchart.component';
@NgModule({
  declarations: [AccountChartComponent, CreateAccountChartComponent],
  imports: [
    CommonModule,
    AccountChartRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule
  ],
  providers: [ProductService, CreateAccountChartComponent, AccountChartService],
  entryComponents: [CreateAccountChartComponent]
})
export class AccountChartModule { }

