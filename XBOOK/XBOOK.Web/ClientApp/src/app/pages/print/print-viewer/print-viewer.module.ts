import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintViewerComponent } from './print-viewer.component';
import { PrintViewerRoutingModule } from './print-viewer-routing.module';
import { DxReportViewerModule } from 'devexpress-reporting-angular';

@NgModule({
  imports: [
    CommonModule,
    PrintViewerRoutingModule,
    DxReportViewerModule,
  ],
  declarations: [PrintViewerComponent],
})
export class PrintViewerModule { }
