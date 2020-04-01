import { Component, Injector, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PagedRequestDto, PagedListingComponentBase } from '../../../coreapp/paged-listing-component-base';
import { BuyInvoiceView } from '../../_shared/models/invoice/buy-invoice-view.model';
import { DatatableSorting } from '../../../shared/model/datatable-sorting.model';
import { DataService } from '../../_shared/services/data.service';
import { InvoiceService } from '../../_shared/services/invoice.service';
import { BuyInvoiceService } from '../../_shared/services/buy-invoice.service';
import { ActionType, SearchType } from '../../../coreapp/app.enums';
import { CreatePaymentReceiptComponent } from '../../paymentreceipt/payment-receipt/payment-receipt.component';
import { AppConsts } from '../../../coreapp/app.consts';
import { CommonService } from '../../../shared/service/common.service';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
class PagedInvoicesRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  moduleId: module.id, // this is the key
  selector: 'xb-list-buyinvoice',
  templateUrl: './list-buyinvoice.component.html',
  styleUrls: ['./list-buyinvoice.component.scss'],
})
export class ListBuyInvoiceComponent extends PagedListingComponentBase<BuyInvoiceView> {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  @ViewChildren('cb') checkBoxField: QueryList<any>;
  sum: number;
  checkboxInvoice: Subscription = new Subscription();
  client: string;
  searchForm: FormGroup;
  buyinvoiceViews: BuyInvoiceView[];
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
  constructor(
    private data: DataService,
    injector: Injector,
    private invoiceService: InvoiceService,
    private buyInvoiceService: BuyInvoiceService,
    private router: Router,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal) {
    super(injector);
    this.commonService.CheckAssessFunc('Buy invoice');
    this.searchForm = this.createForm();
    this.recalculateOnResize(() => this.buyinvoiceViews = [...this.buyinvoiceViews]);
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
      // dueDate: this.isDue,
    });
  }

  protected list(
    request: PagedInvoicesRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    this.loadingIndicator = true;
    request.keyword = this.searchString;
    const requestList = {
      keyword: this.keyword.toLocaleLowerCase(),
      startDate: '',
      endDate: '',
      isIssueDate: true,
    };
    this.data.getMessagebuyInvoice().subscribe(rp => {
      if(rp !== undefined){
        this.buyinvoiceOfChart();
      } else {
        this.buyInvoiceOfClient(requestList);
      }
    });      
  }
  buyinvoiceOfChart() {
    this.data.getMessagebuyInvoice().subscribe(rp => {
      if (rp !== undefined) {
        console.log(rp.data.startDate);
        console.log(rp.data.endDate);
        const rs = {
          keyword: '',
          startDate:  rp.data.startDate,
          endDate: rp.data.endDate,
          isIssueDate: this.ischeck,
        };
        this.buyInvoiceService.getAllBuyInvoiceList(rs).pipe(
        ).subscribe((i: any) => {         
          this.buyinvoiceViews = i;
          this.listInvoice = this.buyinvoiceViews;
        });
      }
    });

  }
  buyInvoiceOfClient(request) {
    this.data.getMessage().subscribe(rp => {

      if (rp !== undefined) {
        this.client = rp.data;
        if (this.dateFilters !== '') {
          const rs = {
            keyword: this.keyword.toLocaleLowerCase() + this.client,
            startDate: this.startDate,
            endDate: this.endDate,
            isIssueDate: this.ischeck,
          };
          this.buyInvoiceService.getAllBuyInvoiceList(rs).pipe(
          ).subscribe((i: any) => {
            this.loadingIndicator = false;
            this.buyinvoiceViews = i;
            this.listInvoice = this.buyinvoiceViews;
          }, (er) => {
            this.commonService.messeage(er.status);
          });
        } else {
          const requestList = {
            keyword: this.keyword.toLocaleLowerCase() + this.client,
            startDate: '',
            endDate: '',
            isIssueDate: true,
          };
          this.buyInvoiceService.getAllBuyInvoiceList(requestList).pipe(
          ).subscribe((i: any) => {
            this.loadingIndicator = false;
            this.buyinvoiceViews = i;
            this.listInvoice = this.buyinvoiceViews;
          }, (er) => {
            this.commonService.messeage(er.status);
          });
        }
      } else {
        this.getBuyInvoice(request);
      }

    });
  }

  getBuyInvoice(request) {
    if (this.dateFilters !== '') {
      const rs = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: this.startDate,
        endDate: this.endDate,
        isIssueDate: this.ischeck,
      };
      this.buyInvoiceService.getAllBuyInvoiceList(rs).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.buyinvoiceViews = i;
        this.listInvoice = this.buyinvoiceViews;
      }, (er) => {
          this.commonService.messeage(er.status);
      });
    } else {
      this.buyInvoiceService.getAllBuyInvoiceList(request).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.buyinvoiceViews = i;
        this.listInvoice = this.buyinvoiceViews;
      }, (er) => {
        this.commonService.messeage(er.status);
      });
    }
  }

  public getGrantTotal(): number {
    return _.sumBy(this.buyinvoiceViews, item => {
      return item.amountPaid;
    });
  }
  deleteAll(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = [];
    this.selected.forEach(element => {
      // this.deleteInvoice(element.invoiceId);
      const id = element.invoiceId;
      requestDl.push({ id });
    });
    this.buyInvoiceService.deleteBuyInvoice(requestDl).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    }, (er) => {
      this.commonService.messeage(er.status);
    });
    this.selected = [];
  }
  edit(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }
    if (this.selected.length > 1) {
      this.message.warning('Only one item selected to edit?');
      return;
    }
    this.redirectToEditInvoice(this.selected[0].id);
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
    const duration = moment.duration(moment(duceDate).diff(moment(issueDate)));
    const numberDuceDate = duration.asDays();
    return `Duce in ${numberDuceDate} days`;
  }
  plusRow(subTotal: any, vat: any, discount: any) {
    const plus = (subTotal + vat) - discount;
    return plus;
  }
  redirectToCreateNewInvoice() {
    this.router.navigate([`/pages/buyinvoice/new`]);
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/pages/buyinvoice/${id}/${ActionType.Edit}`]);
  }

  delete(id: number, invoiceNumber: string, invoiceSerial: string): void {
    this.isCheckBackTo = true;
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this buy invoice ?', 'Are you sure ?', () => {
      this.deleteInvoice(id);
      const request = {
        invoice: invoiceNumber,
        seri: invoiceSerial,
      };
      this.getInFoFile(request);
      this.isCheckBackTo = false;
    });

  }
  private deleteInvoice(id: number): void {
    const request = [{ id }];

    this.buyInvoiceService.deleteBuyInvoice(request).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    },  (er) => {
      this.commonService.messeage(er.status);
    });
  }

  getInFoFile(request) {
    this.invoiceService.getInfofile(request).subscribe(rp => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rp.length; index++) {
        const rs = {
          fileName: rp[index].fileName,
        };
        this.invoiceService.removeFile(rs).subscribe(() => { }, (er) => {
          this.commonService.messeage(er.status);
        });
      }
    });
  }

  addPayment() {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }

    if (this.selected.filter(x => x.supplierID !== this.selected[0].supplierID).length !== 0) {
      this.message.warning('Please choose the same client');
      return;
    }
    const data = [];
    const invoiceId = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selected.length; i++) {
      const amountDue = this.selected[i].amount - this.selected[i].amountPaid;
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
    const dialog = this.modalService.open(CreatePaymentReceiptComponent, AppConsts.modalOptionsCustomSize);

    dialog.componentInstance.outstandingAmount = this.sum;
    dialog.componentInstance.invoice = invoiceId;
    dialog.componentInstance.supplierID = this.selected[0].supplierID;
    dialog.componentInstance.supplierName = this.selected[0].supplierName;
    dialog.componentInstance.contactName = this.selected[0].contactName;
    dialog.componentInstance.bankAccount = this.selected[0].bankAccount;
    // dialog.componentInstance.invoiceId = this.selected[0].invoiceId;
    dialog.result.then(result => {
      if (result) {

      }
      this.refresh();
      this.selected = [];
    });
  }
  public getOutstanding(): number {
    return _.sumBy(this.buyinvoiceViews, item => {
      return 125.4 * 1000000;
    });
  }
  public getOverduce(): number {
    return _.sumBy(this.buyinvoiceViews, item => {
      return 12.5 * 1000000;
    });
  }
  public getInDraft(): number {
    return _.sumBy(this.buyinvoiceViews, item => {
      return 23.5 * 1000000;
    });
  }

  applySearchFilter(formFilter: FormGroup) {
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
      };
      this.getBuyInvoice(requestList);
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
        this.router.navigate([`/pages/buyinvoice/${event.row.invoiceId}/${ActionType.View}`]);
      }
    }
  }
  sortClient() {
    this.buyinvoiceViews.sort((l, r): number => {
      if (l.supplierName < r.supplierName) { return -1; }
      if (l.supplierName > r.supplierName) { return -1; }
      return 0;
    });
    this.buyinvoiceViews = [...this.buyinvoiceViews];
  }

  onSort(e: any) {

  }
}
