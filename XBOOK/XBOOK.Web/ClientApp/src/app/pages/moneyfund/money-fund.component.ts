import { Component, Injector } from '@angular/core';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchMoneyFundComponent } from './searchmoney-fund/searchmoney-fund.component';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';
import { MoneyFundService } from '../_shared/services/moneyfund.service';
import { MoneyFundListData } from '../_shared/models/moneyfund/sales-report-view.model';
import { InvoiceService } from '../_shared/services/invoice.service';
import { AuthenticationService } from '../../coreapp/services/authentication.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-money',
  templateUrl: './money-fund.component.html',
  styleUrls: ['./money-fund.component.scss'],
})
export class MoneyFundComponent extends PagedListingComponentBase<ClientView> {
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  moneyViewsrequst: MoneyFundListData[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: any;
  tempaccount: any;
  requestSaveJson: any[] = [];
  genViewsReport: any[] = [];
  salesViewsreport : any[] = [];
  genViews: any;
  startDay: any;
  endDay: any;
  keyspace: any;
  loadingIndicator = false;
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  protected delete(id: number): void {
    throw new Error(' Method not implemented.');
  }

  constructor(
    injector: Injector,
    public auth: AuthenticationService,
    private data: DataService,
    private invoiceService: InvoiceService,
    private activeRoute: ActivatedRoute,   
    private moneyFundService: MoneyFundService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Money Fund');
    this.recalculateOnResize(() => {
      this.genViews.forEach((view, index) => {
        this.genViews[index].MoneyFundListData = [...view.MoneyFundListData];
      });
    });
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.auth.getAuthToken() as string;
    request = request.clone({
      setHeaders: {
       'Authorization': 'Bearer ' + authToken,
      }
    });
    return next.handle(request);
  }
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {

    this.data.getMessageMoneyFund().subscribe(rp => {
      const genledSearch = {
        startDate: rp.data.startDate === undefined ? null : rp.data.startDate,
        endDate: rp.data.endDate === undefined ? null : rp.data.endDate,    
      };
      this.startDay = rp.data.startDate;
      this.keyspace = ' - ';
      this.endDay = rp.data.endDate;
      this.moneyFundService
      .searchMoneyFund(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.genViews = i;
        this.moneyViewsrequst = this.genViews;       
        this.gettotalCollectMoney();
        this.gettotalPayMoney();
        this.gettotalResidualFund();
      }); 
      this.moneyFundService.getDataReport(genledSearch).subscribe(rp => {
        this.genViewsReport = rp;
        this.salesViewsreport = this.genViewsReport;
      });
      this.getProfiles();
    });     
  }

  public gettotalCollectMoney(): number {
    return _.sumBy(this.moneyViewsrequst, item => {
      return item.totalCollectMoney;
    });
  }
  public gettotalPayMoney(): number {
    return _.sumBy(this.moneyViewsrequst, item => {
      return item.totalPayMoney;
    });
  }
  public gettotalResidualFund(): number {
    return _.sumBy(this.moneyViewsrequst, item => {
      return item.totalResidualFund;
    });
  }

  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchMoneyFundComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
        const genledSearch = {
        startDate:result.startDate === undefined ? null : result.startDate,
        endDate: result.endDate === undefined ? null : result.endDate, 
        };
        this.moneyFundService.searchMoneyFund(genledSearch).subscribe(rp => {
          this.genViews = rp;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
          this.moneyViewsrequst = this.genViews
          this.gettotalCollectMoney();
          this.gettotalPayMoney();
          this.gettotalResidualFund();
        });    
        this.moneyFundService.getDataReport(genledSearch).subscribe(rp => {
          this.genViewsReport = rp;
          this.salesViewsreport = this.genViewsReport;
        });   
    });

  }

  getProfiles() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.taxCode = rp.taxCode;
      this.companyAddress = rp.address;
      this.companyCode = rp.code;
    });
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    console.log(this.companyName);
    console.log(this.salesViewsreport);
    for (let j = 0; j < this.salesViewsreport.length; j++) {
      const data = {
        companyNameName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        MoneyFund: this.salesViewsreport[j].moneyFund,
        invoiceNumber: this.salesViewsreport[j].invoiceNumber,
        date: this.salesViewsreport[j].date,
        note: this.salesViewsreport[j].note,
        CollectMoney: this.salesViewsreport[j].collectMoney,
        PayMoney: this.salesViewsreport[j].payMoney,
        ResidualFund: this.salesViewsreport[j].residualFund,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.requestSaveJson.push(data);
    }
    const reportName = 'Money Fund';
    this.moneyFundService.reportSaveDataPrint(this.requestSaveJson).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  getRowHeight(row) {
    return row.height;
  }

  onSort(e: any) {

  }

  sortClient() {

  }
  redirectToEditInvoice(id) {

    let clientName = '';

    clientName = id;
    this.data.sendMessage(clientName);
    this.router.navigate([`/pages/invoice`]);
  }

}
