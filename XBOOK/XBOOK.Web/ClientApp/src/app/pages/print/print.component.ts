import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectReportComponent } from './selectreport/selectreport.component';
import { AppConsts } from '../../coreapp/app.consts';

@Component({
  selector: 'xb-print',
  templateUrl: './print.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../node_modules/jquery-ui/themes/base/all.css',
    '../../../../node_modules/devextreme/dist/css/dx.common.css',
    '../../../../node_modules/devextreme/dist/css/dx.light.css',
    '../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css',
    '../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css',
    '../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css',
    '../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css',
    '../../../../node_modules/devexpress-reporting/dist/css/dx-reportdesigner.css'
  ]
})
export class PrintComponent implements OnInit {
  ischeck: boolean;
  reportUrl: string;
  case: any;
  getDesignerModelAction: string;
  invokeAction = '/DXXRDV';

  public hostUrl = environment.apiBaseUrl;
  constructor(
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal
  ) { }
  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params.key === 'design') {
        const dialog = this.modalService.open(SelectReportComponent, AppConsts.modalOptionsCustomSize);
        dialog.result.then(result => {
          if (result) {
            this.case = result.case;
            this.ischeck = true;
            // this.getDesignerModelAction = `api/ReportDesigner/GetReportDesignerModel/InvoiceReport`;
            this.getDesignerModelAction = `api/ReportDesigner/GetReportDesignerModel/${this.case}`;
          }
         
        });
      } else {
        this.reportUrl = params.key;
      }
    });

  }
}
