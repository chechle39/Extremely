import { Component, Injector } from '@angular/core';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchType, ActionType } from '../../coreapp/app.enums';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../_shared/services/invoice.service';
import { SearchAccountDetailComponent } from './searchaccount-detail/searchaccount-detail.component';
import { AccountDetailService } from '../_shared/services/accountdetail.service';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';


class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-accountdetail',
  templateUrl: './accountdetail.component.html',
  styleUrls: ['./accountdetail.component.scss'],
})
export class AccountDetailComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  // salesViewsrequst: SalesReportListData[] = [];
  accdetailViewsreport: any[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: string;
  tempaccount: any;
  requestSaveJson: any[] = [];
  case: any;
  genViews: any;
  startDay: any;
  ViewsReport: any;
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
    private data: DataService,
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private commonService: CommonService,
    private accountDetailService: AccountDetailService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Account Detail');
  }

  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {

    const date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const genledSearch = {
      startDate: this.firstDate === undefined ? null : this.firstDate,
      endDate: this.endDate1 === undefined ? null : this.endDate1,
      client: null,
      accountNumber: null,
    };
    this.accountDetailService
      .searchGen(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.genViews = i;
      });
    this.accountDetailService.getDataReport(genledSearch).subscribe(rp => {
      this.ViewsReport = rp;
      this.accdetailViewsreport = this.ViewsReport;
    });
    this.getProfiles();
  }



  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchAccountDetailComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
        const genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          client: result.client,
          accountNumber: result.acountNumberMethod,
        };
        this.exportCSV = result;
        this.accountDetailService.searchGen(genledSearch).subscribe(rp => {
          this.genViews = rp;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
        });
        this.accountDetailService.getDataReport(genledSearch).subscribe(rp => {
          this.ViewsReport = rp;
          this.accdetailViewsreport = this.ViewsReport;
        });
    });

  }
  getRowHeight(row) {
    return row.height;
  }

  onSort(e: any) {

  }

  sortClient() {

  }
  getProfiles() {
    const Datasession = JSON.parse(sessionStorage.getItem('credentials'));
      this.companyName = Datasession.companyProfile[0].companyName;
      this.taxCode = Datasession.companyProfile[0].taxCode;
      this.companyAddress = Datasession.companyProfile[0].address;
      this.companyCode = Datasession.companyProfile[0].code;
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.accdetailViewsreport.length; j++) {
      const data = {
        companyNameName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        accountNumber: this.accdetailViewsreport[j].accountNumber,
        accountName: this.accdetailViewsreport[j].accountName,
        companyName: this.accdetailViewsreport[j].companyName,
        invoiceNumber: this.accdetailViewsreport[j].invoiceNumber,
        date: this.accdetailViewsreport[j].date,
        transactionNo: this.accdetailViewsreport[j].transactionNo,
        reference: this.accdetailViewsreport[j].reference,
        crspAccNumber: this.accdetailViewsreport[j].crspAccNumber,
        debit: this.accdetailViewsreport[j].debit,
        credit: this.accdetailViewsreport[j].credit,
        debitClosing: this.accdetailViewsreport[j].debitClosing,
        creditClosing: this.accdetailViewsreport[j].creditClosing,
        debitOpening : this.accdetailViewsreport[j].debitOpening,
        creditOpening: this.accdetailViewsreport[j].creditOpening,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.requestSaveJson.push(data);
    }
    const reportName = 'Account Detail';
    this.accountDetailService.AccountDeatilreportSaveDataPrint(this.requestSaveJson).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  getinvoice(id) {

    let clientName = '';

    clientName = id;
    this.data.sendMessage(clientName);
    this.router.navigate([`/pages/invoice`]);
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/pages/invoice/${id}/${ActionType.Edit}`]);
  }
}

