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
import { PurchaseReportListData } from '../_shared/models/purchasereport/PurchaseReportListData';
import { InvoiceService } from '../_shared/services/invoice.service';
import { SearchPurchaseReportComponent } from './searchpurchase-report/searchpurchase-report.component';
import { PurchaseReportService } from '../_shared/services/purchasereport.service';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';


class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-purchase',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.scss'],
})
export class PurchaseReportComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  purchaseViewsrequst: PurchaseReportListData[] = [];
  purchaseViewsreport: any[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: string;
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
    private invoiceService: InvoiceService,
    private purchaseReportService: PurchaseReportService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Purchase Report');
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
    this.purchaseReportService
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
        this.purchaseViewsrequst = this.genViews;
        this.gettotalAmount();
        this.gettotalQuantity();
      });
    this.purchaseReportService.getDataReport(genledSearch).subscribe(rp => {
      this.genViewsReport = rp;
      this.purchaseViewsreport = this.genViewsReport;
    });
    this.getProfiles();
  }

 gettotalAmount(): number {
    return _.sumBy(this.purchaseViewsrequst, item => {
      return item.totalAmount;
    });
  }
 gettotalDiscount(): number {
    return _.sumBy(this.purchaseViewsrequst, item => {
      return item.totalDiscount;
    });
  }
 gettotalQuantity(): number {
    return _.sumBy(this.purchaseViewsrequst, item => {
      return item.totalQuantity;
    });
  }

  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchPurchaseReportComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      const genledSearch = {
        startDate: result.startDate,
        endDate: result.endDate,
        client: result.client === '' ? null : result.client ,
        product: result.product === '' ? null :  result.product,
      };
      this.exportCSV = result;
      this.purchaseReportService.searchGen(genledSearch).subscribe(rp => {
        this.genViews = rp;
        this.purchaseViewsrequst = this.genViews;
        this.case = result.case;
        this.startDay = result.startDate;
        this.endDay = result.endDate;
        this.keyspace = ' - ';
        this.gettotalAmount();
        this.gettotalQuantity();
      });
      this.purchaseReportService.getDataReport(genledSearch).subscribe(rp => {
        this.genViewsReport = rp;
        this.purchaseViewsreport = this.genViewsReport;
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
    for (let j = 0; j < this.purchaseViewsreport.length; j++) {
      const data = {
        companyNameName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        productName: this.purchaseViewsreport[j].productName,
        supplierName: this.purchaseViewsreport[j].supplierName,
        invoiceNumber: this.purchaseViewsreport[j].invoiceNumber,
        date: this.purchaseViewsreport[j].issueDate,
        price: this.purchaseViewsreport[j].price,
        amount: this.purchaseViewsreport[j].amount,
        discount: this.purchaseViewsreport[j].discount,
        quantity: this.purchaseViewsreport[j].quantity,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.requestSaveJson.push(data);
    }
    const reportName = 'Purchase Report';
    this.purchaseReportService.PurchReportSaveDataPrint(this.requestSaveJson).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  // getinvoice(id) {

  //   let clientName = '';

  //   clientName = id;
  //   this.data.sendMessage(clientName);
  //   this.router.navigate([`/invoice`]);
  // }
  getinvoice(id) {
    if (id !== 0 || id !== undefined) {
      this.router.navigate([`/pages/buyinvoice/${id}/${ActionType.Edit}`]);
    }
  }
}

