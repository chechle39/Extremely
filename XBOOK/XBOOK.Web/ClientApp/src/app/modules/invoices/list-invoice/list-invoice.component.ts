import { Component, OnInit, Injector, Input, ViewChild } from '@angular/core';
import { DatatableSorting } from '@shared/model/datatable-sorting.model';
import { Router } from '@angular/router';
import { InvoiceView } from '@modules/_shared/models/invoice/invoice-view.model';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { debounceTime, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { AppConsts } from '@core/app.consts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from '../create-invoice/payment/add-payment/add-payment.component';
import { SearchType, ActionType } from '@core/app.enums';
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
  invoiceViews: InvoiceView[];
  searchKeywordClass: string;
  private defaultSortOrder = 'ASC';
  private defaultSortBy = 'INVOICE_NUMBER';
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
  constructor(
    injector: Injector,
    private invoiceService: InvoiceService,
    private router: Router,
    private modalService: NgbModal) {
    super(injector);
  }

  protected list(
    request: PagedInvoicesRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    this.loadingIndicator = true;
    request.keyword = this.searchString;
    const requestList = {
      keyword: '',
      startDate: '',
      endDate: '',
      isIssueDate: true
    };
    this.invoiceService.getAll(requestList).pipe(
      debounceTime(500),
      finalize(() => {
        finishedCallback();
      })
    ).subscribe((i: any) => {
      this.loadingIndicator = false;
      this.invoiceViews = i;
    });
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
    this.selected.forEach(element => {
      this.deleteInvoice(element.id);
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
  redirectToCreateNewInvoice() {
    this.router.navigate([`/invoice/new`]);
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/invoice/${id}/${ActionType.Edit}`]);
  }
  delete(id: number): void {
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this invoice ?', 'Are you sure ?', () => {
      this.deleteInvoice(id);
    });

  }
  private deleteInvoice(id: number): void {
    this.invoiceService.deleteInvoice(id).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    });
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
    dialog.componentInstance.invoiceId = this.selected[0].id;
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
  applySearchFilter(formFilter: NgForm) {
    this.isSubmitted = true;
    //const isValidDate = this.validateDates(form.value, this.model.EndDate);
    if (!formFilter.valid) {
      return false;
    } else {
      // tslint:disable-next-line:max-line-length
      const startDate = moment([formFilter.value.startDate.year, formFilter.value.startDate.month - 1, formFilter.value.startDate.day]).format(AppConsts.defaultDateFormat);
      // tslint:disable-next-line:max-line-length
      const endDate = moment([formFilter.value.endDate.year, formFilter.value.endDate.month - 1, formFilter.value.endDate.day]).format(AppConsts.defaultDateFormat);
      this.dateFilters = `${startDate} - ${endDate}`;
      this.searchPanel.close();

      const searchType = formFilter.value.searchType;
      const searchStr = { seachString: this.keyword, from: startDate, to: endDate };
      if (searchType === SearchType.IssueDate) {
        searchStr[SearchType.IssueDate] = true;
      }
      if (searchType === SearchType.DueDate) {
        searchStr[SearchType.DueDate] = true;
      }
      this.searchString = this.keyword; //JSON.stringify(searchStr);
      this.refresh();
      alert(JSON.stringify(searchStr));
    }
  }
  clearFilter(formFilter: NgForm) {
    this.isSubmitted = false;
    this.dateFilters = this.keyword = '';
    formFilter.resetForm();
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click' && event.value !== '') {
      event.cellElement.blur();
      this.router.navigate([`/invoice/${event.row.invoiceId}/${ActionType.View}`]);
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
