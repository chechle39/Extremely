import {
  Component,
  Injector,
  ViewChild,
  QueryList,
  ViewChildren } from '@angular/core';
import { DatatableSorting } from '../../../shared/model/datatable-sorting.model';
import { Router } from '@angular/router';
import { InvoiceView } from '../../_shared/models/invoice/invoice-view.model';
import {
  PagedListingComponentBase,
  PagedRequestDto } from '../../../coreapp/paged-listing-component-base';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  FormGroup,
  FormBuilder } from '@angular/forms';
import { AppConsts } from '../../../coreapp/app.consts';
import { SearchType, ActionType } from '../../../coreapp/app.enums';
import { Subscription } from 'rxjs';
import { DataService } from '../../_shared/services/data.service';
import { JournalEntryService } from '../../_shared/services/journal-entry.service';
import { JournalEntryViewModel } from '../../_shared/models/journalentry/journalentry.model';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { CommonService } from '../../../shared/service/common.service';
import { CreateMasterComponent } from '../create/create-masterparam.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMasterComponent } from '../update/update-masterparam.component';
class PagedInvoicesRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  moduleId: module.id,
  selector: 'xb-list-journalentries',
  templateUrl: './list-journalentries.component.html',
  styleUrls: ['./list-journalentries.component.scss'],
})
export class ListJournalEntriesComponent extends PagedListingComponentBase<InvoiceView> {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  @ViewChildren('cb') checkBoxField: QueryList<any>;
  sum: number;
  checkboxInvoice: Subscription = new Subscription();
  client: string;
  searchForm: FormGroup;
  invoiceViews: JournalEntryViewModel[];
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
  isCheckOpen: boolean;
  isCheckFillter: boolean = false;
  requesSearchtList: { keyword: string; startDate: string; endDate: string };
  constructor(
    private data: DataService,
    private journalEntryService: JournalEntryService,
    injector: Injector,
    private modalService: NgbModal,
    public authenticationService: AuthenticationService,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder) {
    super(injector);
    this.commonService.CheckAssessFunc('Journal Entries');
    this.searchForm = this.createForm();
    this.getDataSearch();
  }
  getDataSearch() {
    this.data.getApplySearchJunal().subscribe(rp => {
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
    const firstDateMonthCurent = { year: Number(firstDateMonth[2]),
      month: Number(firstDateMonth[1]), day: Number(firstDateMonth[0]) };
    const endDateMonth = endDate.split('/');
    const endDateMonthCurent = { year: Number(endDateMonth[2]),
      month: Number(endDateMonth[1]), day: Number(endDateMonth[0]) };
    return this.fb.group({
      startDate: [firstDateMonthCurent],
      endDate: [endDateMonthCurent],
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
    // const requestList = {
    //   keyword: this.keyword.toLocaleLowerCase(),
    //   startDate: '',
    //   endDate: '',
    // };
    if (this.requesSearchtList === undefined) {
      const requestList = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: '',
        endDate: '',
       // isIssueDate: true,
      };
      this.getJournalEntry(requestList);
    }
    if (this.requesSearchtList !== undefined) {
      const requestList = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: this.startDate !== undefined ? this.startDate : this.requesSearchtList.startDate,
        endDate: this.endDate !== undefined ? this.endDate : this.requesSearchtList.endDate,
      //  isIssueDate: this.ischeck !== undefined ? this.ischeck : this.requesSearchtList.isIssueDate,
      };
      this.getJournalEntry(requestList);
    }
    // if (this.client !== undefined){
    //   this.getInvoice(requestList);
    // }

   // this.getJournalEntry(requestList);
  }

  getJournalEntry(request) {
    if (this.dateFilters !== '') {
      const rs = {
        keyword: this.keyword.toLocaleLowerCase(),
        startDate: this.startDate !== undefined ? this.startDate : this.requesSearchtList.startDate,
        endDate: this.endDate !== undefined ? this.endDate : this.requesSearchtList.endDate,
      };
      this.data.sendApplySearchJunal(rs);
      this.journalEntryService.searchJournal(rs).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.invoiceViews = i;
        this.listInvoice = this.invoiceViews;
      });
    } else {
      this.data.sendApplySearchJunal(request);

      this.journalEntryService.searchJournal(request).pipe(
      ).subscribe((i: any) => {
        this.loadingIndicator = false;
        this.invoiceViews = i;
        this.listInvoice = this.invoiceViews;
      });
    }
  }

  deleteAll(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = [];
    this.selected.forEach(element => {
      // this.deleteInvoice(element.invoiceId);
      const id = element.id;
      requestDl.push({ id });
    });
    this.journalEntryService.deleteJournalById(requestDl).subscribe(() => {
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
    this.data.sendMessage('');
    // this.router.navigate([`pages/journalentries/new`]);
    this.showCreateOrEditClientDialog();
  }
  redirectToEditInvoice(id) {
    this.data.sendMessage('');
    this.showCreateOrEditClientDialog(id);
    // this.router.navigate([`pages/journalentries/${id}/${ActionType.Edit}`]);
  }

  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    if (id === undefined || id <= 0) {
      this.modalService.dismissAll();
      createOrEditClientDialog = this.modalService.open(CreateMasterComponent, AppConsts.modalOptionsLargerSize);
    } else {
      this.modalService.dismissAll();
     createOrEditClientDialog = this.modalService.open(EditMasterComponent, AppConsts.modalOptionsLargerSize);
      createOrEditClientDialog.componentInstance.id = id;
    }
    createOrEditClientDialog.result.then(result => {
      this.refresh();
    });
  }
  delete(id: number): void {
    this.isCheckBackTo = true;
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this journal entries ?', 'Are you sure ?', () => {
      this.deleteInvoice(id);
      this.isCheckBackTo = false;
    });

  }
  private deleteInvoice(id: number): void {
    const request = [{ id }];

    this.journalEntryService.deleteJournalById(request).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
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
      };
      this.getJournalEntry(requestList);
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
        this.redirectToEditInvoice(event.row.id);
      }
    }
  }
  sortClient() {
    this.invoiceViews.sort((l, r): number => {
      if (l.entryName < r.entryName) { return -1; }
      if (l.entryName > r.entryName) { return -1; }
      return 0;
    });
    this.invoiceViews = [...this.invoiceViews];
  }

  onSort(e: any) {

  }
}
