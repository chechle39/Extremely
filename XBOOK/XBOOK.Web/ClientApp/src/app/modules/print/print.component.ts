import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'xb-print',
  templateUrl: './print.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    "../../../../node_modules/jquery-ui/themes/base/all.css",
    "../../../../node_modules/devextreme/dist/css/dx.common.css",
    "../../../../node_modules/devextreme/dist/css/dx.light.css",
    "../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css",
    "../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css",
    "../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css",
    "../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css",
    "../../../../node_modules/devexpress-reporting/dist/css/dx-reportdesigner.css"
  ]
})
export class PrintComponent implements OnInit {

  reportUrl = "Report";
  getDesignerModelAction = `api/ReportDesigner/GetReportDesignerModel/${this.reportUrl}`;
  
  public hostUrl = environment.apiBaseUrl
  constructor() { }
  ngOnInit() {
  }
}
