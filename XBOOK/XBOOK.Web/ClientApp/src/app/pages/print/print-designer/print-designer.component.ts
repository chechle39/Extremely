import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectReportComponent } from '../selectreport/selectreport.component';
import { AppConsts } from '../../../coreapp/app.consts';
import { environment } from '../../../../environments/environment';
import DevExpress from '@devexpress/analytics-core';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { filter, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RouterEvent, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'xb-print-designer',
  templateUrl: './print-designer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../node_modules/jquery-ui/themes/base/all.css',
    '../../../../../node_modules/devextreme/dist/css/dx.common.css',
    '../../../../../node_modules/devextreme/dist/css/dx.light.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css',
    '../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css',
    '../../../../../node_modules/devexpress-reporting/dist/css/dx-reportdesigner.css',
  ],
})
export class PrintDesignerComponent implements OnInit, OnDestroy {
  reportUrl: string;
  case: any;
  getDesignerModelAction: string;
  ischeck: boolean = false;
  public hostUrl = environment.apiBaseUrl;
  public destroyed = new Subject<any>();

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    const authToken = this.authenticationService.getAuthToken() as string;
    DevExpress.Analytics.Utils.ajaxSetup.ajaxSettings = {
      headers: {
        'Authorization': 'Bearer ' + authToken,
      },
    };

    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      pairwise(),
      filter((events: RouterEvent[]) => events[0].url === events[1].url),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    const dialog = this.modalService.open(SelectReportComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {
        this.case = result.case;

          // rerender Designer Component
          this.ischeck = false;
          setTimeout(() => this.ischeck = true,  0);

        // this.getDesignerModelAction = `api/ReportDesigner/GetReportDesignerModel/InvoiceReport`;
        this.getDesignerModelAction = `api/ReportDesigner/GetReportDesignerModel/${this.case}`;
      }
    });

  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
