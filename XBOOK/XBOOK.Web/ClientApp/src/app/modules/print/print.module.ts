import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintComponent } from './print.component';
import { DxReportViewerModule, DxReportDesignerModule } from 'devexpress-reporting-angular';

@NgModule({
  declarations: [PrintComponent],
  imports: [
    CommonModule,
    DxReportViewerModule,
    DxReportDesignerModule
  ]
})
export class PrintModule { }
