import { Component, Injector } from '@angular/core';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchType, ActionType } from '@core/app.enums';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { SearchAccountDetailComponent } from './searchaccount-detail/searchaccount-detail.component';
import { AccountDetailService } from '@modules/_shared/services/accountdetail.service';
import { DataService } from '@modules/_shared/services/data.service';


class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-accountdetail',
  templateUrl: './accountdetail.component.html',
  styleUrls: ['./accountdetail.component.scss']
})
export class AccountDetailComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  // salesViewsrequst: SalesReportListData[] = [];
  salesViewsreport: any[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: string;
  tempaccount: any;
  requestSaveJson: any[] = [];
  case: any;
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
    private data: DataService,
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private accountDetailService: AccountDetailService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }

  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {

    const date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const genledSearch = {
      // startDate: this.firstDate === undefined ? null : this.firstDate,
      // endDate: this.endDate1 === undefined ? null : this.endDate1,
      money: null,
      productName: null
    };


    this.invoiceService.getInfoProfile().subscribe((r: any) => {
      this.companyName = r.companyName;
      this.taxCode = r.taxCode;
      this.companyAddress = r.address;
      this.companyCode = r.code;
    });
    this.accountDetailService
      .searchGen(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.genViews = i;
      });
    // this.accountDetailService.getDataReport(genledSearch).subscribe(rp => {
    //   this.genViewsReport = rp;
    //   this.salesViewsreport = this.genViewsReport;
    // });
    this.getProfiles();
  }



  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchAccountDetailComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
        const genledSearch = {
          // startDate: result.startDate,
          // endDate: result.endDate,
          // client: result.client,
          // product: result.product,
        };
        console.log(result);
        this.exportCSV = result;
        this.accountDetailService.searchGen(genledSearch).subscribe(rp => {
          this.genViews = rp;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
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
  // Print() {
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let j = 0; j < this.salesViewsreport.length; j++) {
  //     const data = {
  //       companyNameName: this.companyName,
  //       companyAddress: this.companyAddress,
  //       productName: this.salesViewsreport[j].productName,
  //       customerName: this.salesViewsreport[j].customerName,
  //       invoiceNumber: this.salesViewsreport[j].invoiceNumber,
  //       date: this.salesViewsreport[j].date,
  //       unitPrice: this.salesViewsreport[j].unitPrice,
  //       amount: this.salesViewsreport[j].amount,
  //       discount: this.salesViewsreport[j].discount,
  //       payment: this.salesViewsreport[j].payment,
  //       startDate: this.startDay === undefined ? this.firstDate : this.startDay,
  //       endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
  //     };
  //     this.requestSaveJson.push(data);
  //   }
  //   const reportName = 'SalesReportReport';
  //   console.log(this.requestSaveJson);
  //   this.salesReportService.SalesreportSaveDataPrint(this.requestSaveJson).subscribe(rp => {
  //     this.router.navigate([`/print/${reportName}`]);
  //   });
  // }
  getinvoice(id) {

    let clientName = '';

    clientName = id;
    this.data.sendMessage(clientName);
    this.router.navigate([`/invoice`]);
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/invoice/${id}/${ActionType.Edit}`]);
  }
}

