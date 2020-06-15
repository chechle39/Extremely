import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import DevExpress from '@devexpress/analytics-core';
import DevExpressViewer from 'devexpress-reporting';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-print-viewer',
  templateUrl: './print-viewer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../node_modules/jquery-ui/themes/base/all.css',
    '../../../../../node_modules/devextreme/dist/css/dx.common.css',
    '../../../../../node_modules/devextreme/dist/css/dx.light.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css',
    '../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css',
  ],
})
export class PrintViewerComponent implements OnInit {
  reportUrl: string;
  invokeAction = '/DXXRDV';

  public hostUrl = environment.apiBaseUrl;

  constructor(
    private activeRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    const authToken = this.authenticationService.getAuthToken() as string;
    DevExpress.Analytics.Utils.ajaxSetup.ajaxSettings = {
      headers: {
        'Authorization': 'Bearer ' + authToken,
      },
    };

     DevExpressViewer.Reporting.Viewer.Settings.TimeOut = 30000;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.reportUrl = params.key;
    });
  }
}
