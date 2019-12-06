import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { DxReportViewerModule, DxReportDesignerModule } from 'devexpress-reporting-angular';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxReportViewerModule,
    DxReportDesignerModule,
  ]
})
export class DashboardModule { }
