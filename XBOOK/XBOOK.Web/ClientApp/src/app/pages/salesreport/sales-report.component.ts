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
import { SalesReportListData } from '../_shared/models/salesreport/sales-report-view.model';
import { InvoiceService } from '../_shared/services/invoice.service';
import { SearchsalesReportComponent } from './searchsales-report/searchsales-report.component';
import { SalesReportService } from '../_shared/services/salesreport.service';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';


class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-sales',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  salesViewsrequst: SalesReportListData[] = [];
  salesViewsreport: any[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: any;
  tempaccount: any;
  requestSaveJson: any[] = [];
  case: any;
  genViews: any;
  genViewsReport: any;
  genViewsreport: any;
  genViewsTemp: any;
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
    private data: DataService,
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private salesReportService: SalesReportService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Sales Report');
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
      money: null,
      productName: null,
    };


    this.invoiceService.getInfoProfile().subscribe((r: any) => {
      this.companyName = r.companyName;
      this.taxCode = r.taxCode;
      this.companyAddress = r.address;
      this.companyCode = r.code;
    });
    this.salesReportService
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
        const data = [];
        this.salesViewsrequst = this.genViews;
        this.gettotalAmount();
        this.gettotalPayment();
      });
    this.salesReportService.getDataReport(genledSearch).subscribe(rp => {
      this.genViewsReport = rp;
      this.salesViewsreport = this.genViewsReport;
    });
    this.getProfiles();
  }

  public gettotalAmount(): number {
    return _.sumBy(this.salesViewsrequst, item => {
      return item.totalAmount;
    });
  }
  public gettotalDiscount(): number {
    return _.sumBy(this.salesViewsrequst, item => {
      return item.totalDiscount;
    });
  }
  public gettotalPayment(): number {
    return _.sumBy(this.salesViewsrequst, item => {
      return item.totalQuantity;
    });
  }

  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchsalesReportComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
        const genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          client:result.client === '' ? null : result.client ,
          product:result.product === '' ? null :  result.product,
        };
        this.exportCSV = result;
        this.salesReportService.searchGen(genledSearch).subscribe(rp => {
          this.genViews = rp;
          this.salesViewsrequst = this.genViews;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
          this.salesViewsrequst = this.genViews;
          this.gettotalAmount();
          this.gettotalPayment();
        });
        this.salesReportService.getDataReport(genledSearch).subscribe(rp => {
          this.genViewsReport = rp;
          this.salesViewsreport = this.genViewsReport;
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
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.taxCode = rp.taxCode;
      this.companyAddress = rp.address;
      this.companyCode = rp.code;
    });
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.salesViewsreport.length; j++) {
      const data = {
        companyNameName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        productName: this.salesViewsreport[j].productName,
        clientName: this.salesViewsreport[j].clientName,
        invoiceNumber: this.salesViewsreport[j].invoiceNumber,
        issueDate: this.salesViewsreport[j].issueDate,
        price: this.salesViewsreport[j].price,
        amount: this.salesViewsreport[j].amount,
        discount: this.salesViewsreport[j].discount,
        quantity: this.salesViewsreport[j].quantity,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.requestSaveJson.push(data);
    }
    const reportName = 'Sales Report';
    this.salesReportService.SalesreportSaveDataPrint(this.requestSaveJson).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  redirectToEditInvoice(id) {
    let clientName = '';
    clientName = id;
    this.data.sendMessage(clientName);
    this.router.navigate([`/pages/invoice/${id}/${ActionType.Edit}`]);
  }

}

