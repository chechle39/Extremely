import { Component, Injector, ViewChild } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { GetMoneyReceipyRequest } from '../_shared/models/money-receipt/get-money-receipy-request.model';
import * as _ from 'lodash';
import { CreatePaymentReceiptComponent } from './payment-receipt/payment-receipt.component';
import { PaymentReceiptService } from '../_shared/services/payment-receipt.service';
import { PaymentReceiptViewModel } from '../_shared/models/payment-receipt/payment-receipt.model';
import { GetPaymentReceipyRequest } from '../_shared/models/payment-receipt/get-payment-receipy-request.model';
import { AuthenticationService } from '../../coreapp/services/authentication.service';
import { CommonService } from '../../shared/service/common.service';
class PagedMoneyReceiptRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'xb-paymentreceipt',
  templateUrl: './paymentreceipt.component.html',
  styleUrls: ['./paymentreceipt.component.scss'],
})

export class  PaymentReceiptComponent extends PagedListingComponentBase<any> {
  @ViewChild('searchPanel', { static: true }) searchPanel: any;
  loadingIndicator = true;
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
  isCheckBackTo = false;
  moneyReceiptList: PaymentReceiptViewModel[];
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private paymentReceiptService: PaymentReceiptService,
    private commonService: CommonService,
    private modalService: NgbModal) {
    super(injector);
    this.commonService.CheckAssessFunc('Payment Receipt');
    this.searchForm = this.createForm();
  }
  protected list(
    request: PagedMoneyReceiptRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    request.keyword = this.searchString;
    const objRequest = {
      currency: '',
      endDate: this.endDate,
      keyword: this.keyword.toLocaleLowerCase(),
      startDate: this.startDate,
    } as GetMoneyReceipyRequest;
    this.getAllMoneyReceipt(objRequest);
  }

  onSelect({ selected }): void {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getRowHeight(row) {
    return row.height;
  }

  createReceipt() {
    this.showCreateOrEditClientDialog();
  }

  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    createOrEditClientDialog = this.modalService.open(CreatePaymentReceiptComponent, AppConsts.modalOptionsCustomSize);
    createOrEditClientDialog.result.then(result => {
      this.refresh();
      this.selected = [];
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
        currency: '',
      } as GetPaymentReceipyRequest;
      this.getAllMoneyReceipt(requestList);
      // alert(JSON.stringify(searchStr));
    }
  }

  onSort(e: any) {

  }

  sortClient() {
  }

  getAllMoneyReceipt(request: GetPaymentReceipyRequest) {
    this.paymentReceiptService.getAllPaymentReceiptData(request).subscribe((rp: any) => {
      this.loadingIndicator = false;
      this.moneyReceiptList = rp;
    });
  }

  private deleteMoney(id1: number, receiptNumber1): void {
    const idrs = {
      id: id1,
      receiptNumber: receiptNumber1,
    };
    const request = [idrs];

    this.paymentReceiptService.deletePaymentReceipt(request).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
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
      const id = {
        id: element.id,
        receiptNumber: element.receiptNumber,
      };
      requestDl.push(id);
    });
    this.paymentReceiptService.deletePaymentReceipt(requestDl).subscribe(() => {
      this.notify.success('Successfully Deleted');
      this.refresh();
    });
    this.selected = [];
  }

  delete(id: number, receiptNumber): void {
    if (id === 0) { return; }
    this.message.confirm('Do you want to delete this money receipt ?', 'Are you sure ?', () => {
      this.deleteMoney(id, receiptNumber);
    });

  }

  public getGrantTotal(): number {
    return _.sumBy(this.moneyReceiptList, item => {
      return item.amount;
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
    let createOrEditClientDialog;
    createOrEditClientDialog = this.modalService.open(CreatePaymentReceiptComponent,
      AppConsts.modalOptionsCustomSize);
    createOrEditClientDialog.componentInstance.row = this.selected[0];
    createOrEditClientDialog.componentInstance.coppyMode = true;
    createOrEditClientDialog.result.then(result => {
      this.refresh();
      this.selected = [];
    });
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
      if (event.cellIndex > 0 && event.cellIndex < 5) {
        let createOrEditClientDialog;
        event.cellElement.blur();
        createOrEditClientDialog = this.modalService.open(CreatePaymentReceiptComponent,
          AppConsts.modalOptionsCustomSize);
        createOrEditClientDialog.componentInstance.row = event.row;
        createOrEditClientDialog.result.then(result => {
          this.refresh();
          this.selected = [];
        });
      }
    }
  }
}
