import { Component, OnInit, Injector, Input, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DatatableSorting } from '@shared/model/datatable-sorting.model';
import { Router } from '@angular/router';
import { InvoiceView } from '@modules/_shared/models/invoice/invoice-view.model';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { debounceTime, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConsts } from '@core/app.consts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from '../create-invoice/payment/add-payment/add-payment.component';
import { SearchType, ActionType } from '@core/app.enums';
import { Subscription } from 'rxjs';
import { eventNames } from 'cluster';
class PagedInvoicesRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  moduleId: module.id, // this is the key
  selector: 'xb-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListInvoiceComponent extends PagedListingComponentBase<InvoiceView> {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  @ViewChildren('cb') checkBoxField: QueryList<any>;
  checkboxInvoice: Subscription = new Subscription();
  searchForm: FormGroup;
  invoiceViews: InvoiceView[];
  searchKeywordClass: string;
  private defaultSortOrder = 'ASC';
  private defaultSortBy = 'INVOICE_NUMBER';
  isCheckBackTo: boolean = false;
  searchString = '';
  grantTotal: number;
  keyword = '';
  dateFilters = '';
  staticAlertClosed = false;
  sortElement: DatatableSorting[] = [
    { dir: this.defaultSortOrder, prop: this.defaultSortBy }
  ];
  loadingIndicator = true;
  reorderable = true;
  selected = [];
  isSubmitted = false;
  isFirstLoad = false;
  toggle = [];
  ischeck: boolean;
  listInvoice: any;
  isSue: boolean = false;
  isDue: boolean = false;
  startDate: string;
  endDate: string;
  constructor(
    injector: Injector,
    private invoiceService: InvoiceService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.searchForm = this.createForm();
  }

  createForm() {
    var date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const firstDateMonth = firstDate.split('/');
    const firstDateMonthCurent = { year: Number(firstDateMonth[2]), month: Number(firstDateMonth[1]), day: Number(firstDateMonth[0]) };
    const endDateMonth = endDate.split('/');
    const endDateMonthCurent = { year: Number(endDateMonth[2]), month: Number(endDateMonth[1]), day: Number(endDateMonth[0]) };
    return this.fb.group({
      startDate: firstDateMonthCurent,
      endDate: endDateMonthCurent,
      issueDate: ['IssueDate'],
      // dueDate: this.isDue,
    })

  }

  protected list(
    request: PagedInvoicesRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    this.loadingIndicator = true;
    request.keyword = this.searchString;
    const requestList = {
      keyword: this.keyword.toLocaleLowerCase(),
      startDate: '',
      endDate: '',
      isIssueDate: true
    };
    // this.invoiceService.getAll(requestList).pipe(
    //   // debounceTime(500),
    //   finalize(() => {
    //     finishedCallback();
    //   })
    // ).subscribe((i: any) => {
    //   this.loadingIndicator = false;
    //   this.invoiceViews = i;
    //   this.listInvoice = this.invoiceViews;
    // });
    this.getInvoice(requestList);
  }

  getInvoice(request) {
    if (this.dateFilters !== '') {
      const rs = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: this.startDate,
        endDate: this.endDate,
        isIssueDate: this.ischeck
      }
      this.invoiceService.getAll(rs).pipe(
        ).subscribe((i: any) => {
          this.loadingIndicator = false;
          this.invoiceViews = i;
          this.listInvoice = this.invoiceViews;
        })
    }else {
      this.invoiceService.getAll(request).pipe(
        ).subscribe((i: any) => {
          this.loadingIndicator = false;
          this.invoiceViews = i;
          this.listInvoice = this.invoiceViews;
        })
    }
  }

  public getGrantTotal(): number {
    return _.sumBy(this.invoiceViews, item => {
      return item.amountPaid;
    });
  }
  deleteAll(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = []
    this.selected.forEach(element => {
      // this.deleteInvoice(element.invoiceId);
      const id = element.invoiceId
      requestDl.push({ id });
    });
    this.invoiceService.deleteInvoice(requestDl).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
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
    this.router.navigate([`/invoice/new`]);
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/invoice/${id}/${ActionType.Edit}`]);
  }

  delete(id: number, invoiceNumber: string,invoiceSerial: string): void {
    this.isCheckBackTo = true;
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this invoice ?', 'Are you sure ?', () => {
      this.deleteInvoice(id);
      const request = {
        invoice: invoiceNumber,
        seri: invoiceSerial
      }
      this.getInFoFile(request)
      this.isCheckBackTo = false;
    });

  }
  private deleteInvoice(id: number): void {
    const request = [{ id }];
    
    this.invoiceService.deleteInvoice(request).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    });
  }

  getInFoFile(request){
    this.invoiceService.getInfofile(request).subscribe(rp => {
      for (let index = 0; index < rp.length; index++) {
        const rs = {
          fileName: rp[index].fileName
        }
        this.invoiceService.removeFile(rs).subscribe(rp=>{});
      }
    })
  }

  addPayment() {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }
    if (this.selected.length > 1) {
      this.message.warning('Only one item selected to add payment?');
      return;
    }

    const dialog = this.modalService.open(AddPaymentComponent, AppConsts.modalOptionsSmallSize);
    dialog.componentInstance.outstandingAmount = this.selected[0].amountPaid;
    dialog.componentInstance.invoiceId = this.selected[0].invoiceId;
    dialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });
  }
  public getOutstanding(): number {
    return _.sumBy(this.invoiceViews, item => {
      return 125.4 * 1000000;
    });
  }
  public getOverduce(): number {
    return _.sumBy(this.invoiceViews, item => {
      return 12.5 * 1000000;
    });
  }
  public getInDraft(): number {
    return _.sumBy(this.invoiceViews, item => {
      return 23.5 * 1000000;
    });
  }
  //   private validateDates(sDate: string, eDate: string){
  //     this.isValidDate = true;
  //     if((sDate == null || eDate ==null)){
  //       this.error={isError:true,errorMessage:'Start date and end date are required.'};
  //       this.isValidDate = false;
  //     }

  //     if((sDate != null && eDate !=null) && (eDate) < (sDate)){
  //       this.error={isError:true,errorMessage:'End date should be grater then start date.'};
  //       this.isValidDate = false;
  //     }
  //     return this.isValidDate;
  //   }
  //  }
  applySearchFilter(formFilter: FormGroup) {
    this.isSubmitted = true;
    //const isValidDate = this.validateDates(form.value, this.model.EndDate);
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
      this.searchString = this.keyword; //JSON.stringify(searchStr);
      const requestList = {
        keyword: searchStr.seachString,
        startDate: searchStr.from,
        endDate: searchStr.to,
        isIssueDate: this.ischeck,
      };
      this.getInvoice(requestList);
      // alert(JSON.stringify(searchStr));
    }
  }
  clearFilter(formFilter: FormGroup) {
    this.isSubmitted = false;
    this.dateFilters = this.keyword = '';
    //  formFilter.resetForm();
    this.dateFilters = '';
    //this.Adsearch();
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
      if (event.cellIndex > 0 && this.isCheckBackTo === false) {
        this.router.navigate([`/invoice/${event.row.invoiceId}/${ActionType.View}`]);
      }
    }
  }
  sortClient() {
    this.invoiceViews.sort((l, r): number => {
      if (l.clientName < r.clientName) { return -1; }
      if (l.clientName > r.clientName) { return -1; }
      return 0;
    });
    this.invoiceViews = [...this.invoiceViews];
  }

  onSort(e: any) {

  }
}
