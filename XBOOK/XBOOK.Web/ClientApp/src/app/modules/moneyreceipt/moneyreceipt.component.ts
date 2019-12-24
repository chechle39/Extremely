import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateMoneyReceiptComponent } from './create-money-receipt/create-money-receipt.component';
import { AppConsts } from '@core/app.consts';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
class PagedMoneyReceiptRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'xb-moneyreceipt',
  templateUrl: './moneyreceipt.component.html',
  styleUrls: ['./moneyreceipt.component.scss']
})

export class MoneyreceiptComponent extends PagedListingComponentBase<any> {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  moneyReceipy = [
    { x: 'xxx', y: 'xxxx', z: 'zzzz', j: 1, k: 'kkkk' },
    { x: 'xxx', y: 'xxxx', z: 'zzzz', j: 2, k: 'kkkk' }
  ];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected = [];
  reorderable = true;
  searchForm: FormGroup;
  isSubmitted = false;
  startDate: string;
  endDate: string;
  dateFilters = '';
  keyword = '';
  searchString = '';
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.searchForm = this.createForm();
  }
  protected list(
    request: PagedMoneyReceiptRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
  }

  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
    }
  }

  onSelect({ selected }): void {
  }

  getRowHeight(row) {
    return row.height;
  }

  createReceipt() {
    this.showCreateOrEditClientDialog();
  }

  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    createOrEditClientDialog = this.modalService.open(CreateMoneyReceiptComponent, AppConsts.modalOptionsCustomSize);
    createOrEditClientDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }

  createForm() {
    const date = new Date();
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
      this.searchString = this.keyword;
      const requestList = {
        keyword: searchStr.seachString,
        startDate: searchStr.from,
        endDate: searchStr.to,
      };
      // alert(JSON.stringify(searchStr));
    }
  }

  onSort(e: any) {

  }

  sortClient() {
    console.log('xxx');
  }
}
