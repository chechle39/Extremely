import { Component, Injector, QueryList, ViewChildren, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '../../../coreapp/paged-listing-component-base';
import { InvoiceView } from '../../_shared/models/invoice/invoice-view.model';
import { Subscription, forkJoin } from 'rxjs';
import { DatatableSorting } from '../../../shared/model/datatable-sorting.model';
import { InvoiceService } from '../../_shared/services/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../_shared/services/data.service';
import { ActionType, SearchType } from '../../../coreapp/app.enums';
import { AppConsts } from '../../../coreapp/app.consts';
import { CreateMoneyReceiptComponent } from '../../moneyreceipt/create-money-receipt/create-money-receipt.component';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { CommonService } from '../../../shared/service/common.service';
import { TranslateService } from '@ngx-translate/core';
import { MoneyReceiptService } from '../../_shared/services/money-receipt.service';
import { MasterParamService } from '../../_shared/services/masterparam.service';
import { TaxInvoiceService } from '../../_shared/services/taxinvoice.service';
import { TaxBuyInvoiceView } from '../../_shared/models/tax-buy-invoice/tax-buy-invoice-view.model.model';
import { TaxBuyInvoiceService } from '../../_shared/services/tax-buy-invoice.service';
class PagedInvoicesRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'xb-list-tax-buyinvoice',
  styleUrls: ['./list-tax-buyinvoice.component.scss'],
  templateUrl: './list-tax-buyinvoice.component.html',
})

export class ListTaxBuyInvoiceComponent extends PagedListingComponentBase<InvoiceView> implements OnDestroy {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  @ViewChildren('cb') checkBoxField: QueryList<any>;
  sum: number;
  checkboxInvoice: Subscription = new Subscription();
  client: string;
  searchForm: FormGroup;
  invoiceViews: TaxBuyInvoiceView[];
  searchKeywordClass: string;
  private defaultSortOrder = 'ASC';
  private defaultSortBy = 'INVOICE_NUMBER';
  isCheckBackTo = false;
  searchString = '';
  grantTotal: number;
  keyword = '';
  dateFilters = '';
  staticAlertClosed = false;
  sortElement: DatatableSorting[] = [
    { dir: this.defaultSortOrder, prop: this.defaultSortBy },
  ];
  loadingIndicator = true;
  reorderable = true;
  selected = [];
  isSubmitted = false;
  isFirstLoad = false;
  toggle = [];
  ischeck: boolean;
  listInvoice: any;
  isSue: false;
  isDue: false;
  startDate: string;
  endDate: string;
  firstDate: any;
  // tslint:disable-next-line:max-line-length
  requesSearchtList: { keyword: string; startDate: string; endDate: string; isIssueDate: boolean; getDebtOnly: boolean, };
  subscription: Subscription;
  isCheckOpen: boolean;
  isCheckFillter: boolean = false;
  constructor(
    private translate: TranslateService,
    private data: DataService,
    injector: Injector,
    private invoiceService: TaxInvoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private moneyReceiptService: MoneyReceiptService,
    private masterParamService: MasterParamService,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private taxBuyInvoiceService: TaxBuyInvoiceService,
  ) {
    super(injector);
    this.commonService.CheckAssessFunc('Invoice');
    this.searchForm = this.createForm();
    this.getDataSearch();
  }
  getDataSearch() {
    this.data.getApplySearchIv().subscribe(rp => {
      if (rp !== undefined && this.isCheckFillter === false && rp.data !== '') {
        if (rp.data.startDate !== '') {
          this.dateFilters = rp.data.startDate + ' ' + '-' + ' ' + rp.data.endDate;
          this.isCheckOpen = true;
        }
        this.keyword = rp.data.keyword;
        this.requesSearchtList = rp.data;
      }
    });
  }

  createForm() {
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const firstDateMonth = firstDate.split('/');
    const firstDateMonthCurent = {
      year: Number(firstDateMonth[2]),
      month: Number(firstDateMonth[1]),
      day: Number(firstDateMonth[0]),
    };
    const endDateMonth = endDate.split('/');
    const endDateMonthCurent = {
      year: Number(endDateMonth[2]),
      month: Number(endDateMonth[1]),
      day: Number(endDateMonth[0]),
    };
    return this.fb.group({
      startDate: firstDateMonthCurent,
      endDate: endDateMonthCurent,
      issueDate: ['IssueDate'],
    });
  }

  protected list(
    request: PagedInvoicesRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    this.loadingIndicator = true;
    request.keyword = this.searchString;
    if (this.router.url !== '/pages/taxbuyinvoice') {
      this.invoiceOfChart();
    } else {
      this.getSaleInVByRequestSearch();
    }
    // this.getSaleInVByRequestSearch();
  }
  private getSaleInVByRequestSearch() {
    if (this.requesSearchtList === undefined) {
      this.requesSearchtList = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: '',
        endDate: '',
        isIssueDate: true,
        getDebtOnly: false,
      };
      this.invoiceOfClient(this.requesSearchtList);
      this.data.sendApplySearchIv(this.requesSearchtList);
    } else
      if (this.requesSearchtList !== undefined) {
        const requestData = {
          keyword: this.keyword.toLocaleLowerCase(),
          startDate: this.startDate !== undefined ? this.startDate : this.requesSearchtList.startDate,
          endDate: this.endDate !== undefined ? this.endDate : this.requesSearchtList.endDate,
          isIssueDate: this.ischeck !== undefined ? this.ischeck : this.requesSearchtList.isIssueDate,
          getDebtOnly: this.requesSearchtList.getDebtOnly,
        };
        this.invoiceOfClient(requestData);
        this.data.sendApplySearchIv(requestData);

      }
  }


  ngOnDestroy() {
  }
  invoiceOfChart() {
    if (this.route !== undefined) {
      this.route.queryParams
        .subscribe(params => {
          const requestList = {
            keyword: '',
            startDate: params.startDate,
            endDate: params.endDate,
            isIssueDate: false,
            getDebtOnly: false,
          };
          this.taxBuyInvoiceService.getAll(requestList).pipe(
          ).subscribe((i: any) => {
            this.loadingIndicator = false;
            this.invoiceViews = i;
            this.listInvoice = this.invoiceViews;
          });
        });
    }
  }
  invoiceOfClient(request) {
    this.subscription = this.data.getMessage().subscribe(rp => {

      if (rp !== undefined) {
        this.client = rp.data;
        if (this.dateFilters !== '') {
          const rs = {
            keyword: this.keyword.toLocaleLowerCase() + this.client,
            startDate: this.startDate !== undefined ? this.startDate : this.requesSearchtList.startDate,
            endDate: this.endDate !== undefined ? this.endDate : this.requesSearchtList.endDate,
            isIssueDate: this.ischeck !== undefined ? this.ischeck : this.requesSearchtList.isIssueDate,
            getDebtOnly: this.requesSearchtList.getDebtOnly === undefined ? false : this.requesSearchtList.getDebtOnly,
          };
          this.taxBuyInvoiceService.getAll(rs).pipe(
          ).subscribe((i: any) => {
            this.loadingIndicator = false;
            this.invoiceViews = i;
            this.listInvoice = this.invoiceViews;
          });

        } else if (this.client !== '') {
          if (this.requesSearchtList === undefined) {
            const requestList = {
              keyword: this.keyword.toLocaleLowerCase(),
              startDate: '',
              endDate: '',
              isIssueDate: true,
              getDebtOnly: false,
            };
            this.getAllInv(requestList);
          }

          if (this.requesSearchtList !== undefined) {
            const requestList = {
              keyword: this.keyword.toLocaleLowerCase() + this.client,
              startDate: this.startDate !== undefined ? this.startDate : this.requesSearchtList.startDate,
              endDate: this.endDate !== undefined ? this.endDate : this.requesSearchtList.endDate,
              isIssueDate: this.ischeck !== undefined ? this.ischeck : this.requesSearchtList.isIssueDate,
              // tslint:disable-next-line:max-line-length
              getDebtOnly: this.requesSearchtList.getDebtOnly === undefined ? false : this.requesSearchtList.getDebtOnly,
            };
            this.getAllInv(requestList);
          }
        } else {
          this.getInvoice(request);
        }
      } else {
        this.getInvoice(request);
      }
    });
    this.subscription.unsubscribe();
    this.data.sendMessage('');
  }

  private getAllInv(requestList: { keyword: string; startDate: string; endDate: string; isIssueDate: boolean; }) {
    this.taxBuyInvoiceService.getAll(requestList).pipe().subscribe((i: any) => {
      this.loadingIndicator = false;
      this.invoiceViews = i;
      this.listInvoice = this.invoiceViews;
    }, (er) => {
      this.commonService.messeage(er.status);
    });
  }

  getInvoice(request) {
    if (this.dateFilters !== '') {
      const rs = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: this.startDate,
        endDate: this.endDate,
        isIssueDate: this.ischeck,
        getDebtOnly: false,
      };
      this.taxBuyInvoiceService.getAll(rs).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.invoiceViews = i;
        this.listInvoice = this.invoiceViews;
      });
    } else {
      this.taxBuyInvoiceService.getAll(request).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.invoiceViews = i;
        this.listInvoice = this.invoiceViews;
      });
    }
  }

  public getGrantTotal(): number {
    return _.sumBy(this.invoiceViews, item => {
      return item.amountPaid;
    });
  }

  coppy() {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }
    if (this.selected.length > 1) {
      this.message.warning('Only one item selected to edit?');
      return;
    }
    this.router.navigate([`pages/taxbuyinvoice/${this.selected[0].invoiceId}/${ActionType.Coppy}`]);
  }
  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  getRowHeight(row) {
    return row.height;
  }
  calculateDuceDate(issueDate: Date, duceDate: Date): string {
    if (!issueDate || !duceDate) { return ''; }
    const duration = moment(duceDate).diff(moment(), 'days');

    if (duration >= 0) {
      return this.translateService.instant('INVOICE.GRID.ROW.DUCE', { days: duration });
    } else {
      return this.translateService.instant('INVOICE.GRID.ROW.OVERDUCE', { days: Math.abs(duration) });
    }
  }
  plusRow(subTotal: any, vat: any, discount: any) {
    const plus = (subTotal + vat) - discount;
    return plus;
  }
  redirectToCreateNewInvoice() {
    this.router.navigate([`pages/taxbuyinvoice/new`]);
  }
  redirectToEditInvoice(id) {
    this.data.sendMessage('');
    this.router.navigate([`pages/taxbuyinvoice/${id}/${ActionType.Edit}`]);
  }

  delete(id: number, invoiceNumber: string, invoiceSerial: string): void {
    this.isCheckBackTo = true;
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this invoice ?', 'Are you sure ?', () => {
      this.deleteInvoice(id);
      const request = {
        invoice: invoiceNumber,
        seri: invoiceSerial,
      };
      this.getInFoFile(request);
      this.isCheckBackTo = false;
    });

  }
  deleteAll(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = [];
    const file = [];
    this.selected.forEach(element => {
      const id = element.invoiceId;
      const deleted = {
        invoice: element.invoiceNumber,
        seri: element.invoiceSerial,
      };
      file.push(deleted);
      requestDl.push({ id });
    });
    this.invoiceService.deleteInvoice(requestDl).subscribe(() => {
      this.notify.success('Successfully Deleted');
      file.forEach(element => {
        this.getInFoFile(element);
      });
      this.refresh();
    });
    this.selected = [];
  }
  private deleteInvoice(id: number): void {
    const request = [{ id }];

    this.invoiceService.deleteInvoice(request).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    });
  }

  getInFoFile(request) {
    this.invoiceService.getInfofile(request).subscribe(rp => {
      for (let index = 0; index < rp.length; index++) {
        const rs = {
          fileName: rp[index].fileName,
        };
        this.invoiceService.removeFile(rs).subscribe(() => { });
      }
    });
  }

  addPayment() {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }

    if (this.selected.filter(x => x.clientID !== this.selected[0].clientID).length !== 0) {
      this.message.warning('Please choose the same client');
      return;
    }
    const data = [];
    const invoiceId = [];
    let numberInvoice = 'Hóa đơn số: ';
    for (let i = 0; i < this.selected.length; i++) {
      const amountDue = this.selected[i].amount - this.selected[i].amountPaid;
      numberInvoice += this.selected[i].invoiceNumber + ',' + ' ';
      if (amountDue > 0) {
        data.push(amountDue);
        const invoice = {
          invoiceId: this.selected[i].invoiceId,
          dueDate: this.selected[i].dueDate,
          amountIv: amountDue,
        };
        invoiceId.push(invoice);
      }
    }
    this.sum = _.sumBy(data, item => {
      return item;
    });
    forkJoin(
      this.masterParamService.GetMasTerByPayType(),
      this.masterParamService.GetMasTerByMoneyReceipt(),
      this.moneyReceiptService.getLastMoney(),
    ).subscribe(([rp1, rp2, rp3]) => {
      const dialog = this.modalService.open(CreateMoneyReceiptComponent, AppConsts.modalOptionsCustomSize);
      this.translate.get('PAYMENT.TITLE.INVOICE')
        .subscribe(text => { dialog.componentInstance.title = text; });
        dialog.componentInstance.payment = rp1;
        dialog.componentInstance.entryBatternList = rp2;
      dialog.componentInstance.LastMoneyReceipt = rp3;
      dialog.componentInstance.outstandingAmount = this.sum;
      dialog.componentInstance.note = numberInvoice.substring(0, numberInvoice.length - 2);
      dialog.componentInstance.invoice = invoiceId;
      dialog.componentInstance.clientId = this.selected[0].clientID;
      dialog.componentInstance.clientName = this.selected[0].clientName;
      dialog.componentInstance.contactName = this.selected[0].contactName;
      dialog.componentInstance.bankAccount = this.selected[0].bankAccount;
      dialog.result.then(result => {
        if (result) {

        }
        this.refresh();
        this.selected = [];
      });
    });

  }
  public getOutstanding(): number {
    return this.invoiceViews
      ? this.invoiceViews.reduce((sum: number, invoice: any) => sum + (invoice.amount - invoice.amountPaid), 0)
      : 0;
  }
  public getOverduce(): number {
    return 0;
    // return this.invoiceViews
    //   ? this.invoiceViews.map((item: any) => item.amount).reduce((sum, amount) => sum + amount, 0)
    //   : 0;
  }
  public getInDraft(): number {
    return _.sumBy(this.invoiceViews, item => {
      return 23.5 * 1000000;
    });
  }

  applySearchFilter(formFilter: FormGroup) {
    this.isCheckFillter = true;
    this.isSubmitted = true;
    if (!formFilter.valid) {
      return false;
    } else {
      // tslint:disable-next-line:max-line-length
      this.startDate = moment([formFilter.value.startDate.year, formFilter.value.startDate.month - 1, formFilter.value.startDate.day]).format(AppConsts.defaultDateFormatMM);
      // tslint:disable-next-line:max-line-length
      this.endDate = moment([formFilter.value.endDate.year, formFilter.value.endDate.month - 1, formFilter.value.endDate.day]).format(AppConsts.defaultDateFormatMM);
      this.dateFilters = `${this.startDate} - ${this.endDate}`;
      this.searchPanel.close();

      const searchType = formFilter.value.issueDate;
      const searchStr = { seachString: this.keyword, from: this.startDate, to: this.endDate };
      if (searchType === SearchType.IssueDate) {
        searchStr[SearchType.IssueDate] = true;
        this.ischeck = true;
      }
      if (searchType === SearchType.DueDate) {
        searchStr[SearchType.DueDate] = false;
        this.ischeck = false;
      }
      this.searchString = this.keyword;
      const requestList = {
        keyword: searchStr.seachString,
        startDate: searchStr.from,
        endDate: searchStr.to,
        isIssueDate: this.ischeck,
        getDebtOnly: false,
      };
      this.data.sendApplySearchIv(requestList);

      this.getInvoice(requestList);
      // alert(JSON.stringify(searchStr));
    }
  }
  clearFilter(formFilter: FormGroup) {
    this.isSubmitted = false;
    this.dateFilters = this.keyword = '';
    //  formFilter.resetForm();
    this.dateFilters = '';
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
      if (event.cellIndex > 0 && this.isCheckBackTo === false) {
        this.router.navigate([`pages/taxbuyinvoice/${event.row.invoiceId}/${ActionType.View}`]);
      }
    }
  }
  sortClient() {
    this.invoiceViews.sort((l, r): number => {
      if (l.supplierName < r.supplierName) { return -1; }
      if (l.supplierName > r.supplierName) { return -1; }
      return 0;
    });
    this.invoiceViews = [...this.invoiceViews];
  }

  onSort(e: any) {

  }

  exportInvoive() {
    this.invoiceService.ExportInvoice();
  }
  public getTotalTax(): number {
    return _.sumBy(this.invoiceViews, item => {
      return item.taxAmount;
    });
  }
}
