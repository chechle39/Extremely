import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDesignerRoutingModule } from './print-designer-routing.module';
import { PrintDesignerComponent } from './print-designer.component';
import { DxReportDesignerModule, DxReportViewerModule } from 'devexpress-reporting-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PrintService } from '../../_shared/services/print.service';
import { SelectReportComponent } from '../selectreport/selectreport.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DxReportDesignerModule,
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MultiSelectModule,
    PrintDesignerRoutingModule,
  ],
  declarations: [PrintDesignerComponent, SelectReportComponent],
  entryComponents: [SelectReportComponent],
  providers: [PrintService],
})
export class PrintDesignerModule { }
