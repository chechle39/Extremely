import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintComponent } from './print.component';
import { DxReportViewerModule, DxReportDesignerModule } from 'devexpress-reporting-angular';
import { SelectReportComponent } from './selectreport/selectreport.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { PrintService } from '../_shared/services/print.service';
import { PrintRoutingModule } from './print-routing.module';
@NgModule({
  declarations: [PrintComponent, SelectReportComponent],
  entryComponents: [SelectReportComponent],
  imports: [
    CommonModule,
    DxReportViewerModule,
    DxReportDesignerModule,
    CommonModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
    PrintRoutingModule,
  ],
  providers: [PrintService]
})
export class PrintModule { }
