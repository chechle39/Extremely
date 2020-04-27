import { Component, Injector } from '@angular/core';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { DebitAgeService } from '../_shared/services/debitage.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DebitAgeView } from '../_shared/models/debit-age/debitage-view.model';
import { InvoiceService } from '../_shared/services/invoice.service';
import { SearchDebitAgeComponent } from './searchdebit-age/searchdebit-age.component';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';

class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-debit',
  templateUrl: './debit-age.component.html',
  styleUrls: ['./debit-age.component.scss'],
})
export class DebitAgeComponent extends PagedListingComponentBase<ClientView> {
  selected = [];
  case: any;
  fromDate: any;
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  debitageViewsSum: DebitAgeView[];
  requestSaveJson: any[] = [];
  today: any;
  endDate1: string;
  endDate: any;
  companyCode: string;
  tempaccount: any;
  startDay: any;
  debitageViews: any;
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  protected delete(id: number): void {
    throw new Error(' Method not implemented.');
  }

  constructor(
    injector: Injector,
    private data: DataService,
    private invoiceService: InvoiceService,
    public debitAgeService: DebitAgeService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Debit Age');
  }
  public getfirstMonth(): number {
    return _.sumBy(this.debitageViewsSum, item => {
      return item.day0To30;
    });
  }
  public getsecondMonth(): number {
    return _.sumBy(this.debitageViewsSum, item => {
      return item.day31To60;
    });
  }
  public getthirdMonth(): number {
    return _.sumBy(this.debitageViewsSum, item => {
      return item.day61To90;
    });
  }
  public getfourthMonth(): number {
    return _.sumBy(this.debitageViewsSum, item => {
      return item.day90More;
    });
  }
  public getsumtotal(): number {
    return _.sumBy(this.debitageViewsSum, item => {
      return item.subTotal;
    });
  }
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {

    const date = new Date();
    this.today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleDateString('en-GB');
    const genledSearch = {
      money: null,
      firstDate: this.today === undefined ? null : this.today,
    };
    this.debitAgeService
      .GetALLDebitAge(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.debitageViews = i;
        this.debitageViewsSum = this.debitageViews;
        this.getfirstMonth();
        this.getsecondMonth();
        this.getthirdMonth();
        this.getfourthMonth();
        this.getsumtotal();

      });
    this.getProfiles();
  }

  onSelect({ selected }): void {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchDebitAgeComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {
        const genledSearch = {
          money: result.money,
          firstDate: result.endDate === null ?  result.startDate : result.endDate,
        };
        this.exportCSV = result;
        this.debitAgeService.GetALLDebitAge(genledSearch).subscribe(rp => {
          this.debitageViews = rp;
          this.debitageViewsSum = this.debitageViews;
          this.getfirstMonth();
          this.getsecondMonth();
          this.getthirdMonth();
          this.getfourthMonth();
          this.getsumtotal();
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDate = result.endDate;
        });
      }
    });

  }
  onSort(e: any) {

  }

  sortClient() {

  }
  getRowHeight(row) {
    return row.height;
  }
  getProfiles() {
    const Datasession = JSON.parse(sessionStorage.getItem('credentials'));
      this.companyName = Datasession.companyProfile[0].companyName;
      this.companyAddress = Datasession.companyProfile[0].address;
      this.companyCode = Datasession.companyProfile[0].code;
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.debitageViewsSum.length; j++) {
      const data = {
        companyNameName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        clientName: this.debitageViewsSum[j].clientName,
        day0To30: this.debitageViewsSum[j].day0To30,
        day31To60: this.debitageViewsSum[j].day31To60,
        day61To90: this.debitageViewsSum[j].day61To90,
        day90More: this.debitageViewsSum[j].day90More,
        subTotal: this.debitageViewsSum[j].subTotal,
        endDate: this.endDate === undefined ? this.today : this.endDate,
        startDate: this.startDay,
      };
      this.requestSaveJson.push(data);
    }
    const reportName = 'Debit Age';
    this.debitAgeService.DebitAgeSaveDataPrint(this.requestSaveJson).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  getaccNumber(id) {
    let firstDate,
    endDate;
    const t = new Date();
    let clientName = '';

    clientName = id;
   // this.data.sendMessage(clientName);
    const startDay = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
    const lastDay = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 90);
    firstDate = startDay.toLocaleDateString('en-US');
    endDate = lastDay.toLocaleDateString('en-US');
    const genledSearch = {
      startDate: endDate,
      endDate: firstDate,
      keyword: clientName,
      isIssueDate: false,
      getDebtOnly : true,
    };
    this.data.sendApplySearchIv(genledSearch);
    this.router.navigate([`/pages/invoice`]);
  }
}

