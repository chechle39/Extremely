import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { InvoiceService } from '../_shared/services/invoice.service';
import { GenLedService } from '../_shared/services/genled.service';
import { SearchgenledComponent } from './searchgenled/searchgenled.component';
import { saveAs } from 'file-saver';
import { CommonService } from '../../shared/service/common.service';
import { ActionType } from '../../coreapp/app.enums';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-genled',
  templateUrl: './genled.component.html',
  styleUrls: ['./genled.component.scss'],
})
export class GenledComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  case: any;
  firstDate: any;
  endDate1: string;
  genViews: any;
  genViewsreport: any[] = [];
  startDay: any;
  endDay: any;
  companyName: string;
  companyAddress: string;
  companyCode: string;
  keyspace: any;
  loadingIndicator = false;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  protected delete(id: number): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    injector: Injector,
    private genLedService: GenLedService,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('General Ledger');
    this.recalculateOnResize(() => this.genViews = [...this.genViews]);
  }

  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    this.getProfiles();
    const date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const genledSearch = {
      startDate: this.firstDate === undefined ? null : this.firstDate,
      endDate: this.endDate1 === undefined ? null : this.endDate1,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null,
    };

    this.genLedService
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
      });
  }
  public getGrantTotal(): number {
    return _.sumBy(this.genViews, (item: any) => {
      return item.credit;
    });
  }
  public getGrantTotalDebit(): number {
    return _.sumBy(this.genViews, (item: any) => {
      return item.debit;
    });
  }
  redirectToEditInvoice(id) {
    this.router.navigate([`/pages/invoice/${id}/${ActionType.Edit}`]);
  }
  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchgenledComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {

        this.exportCSV = result;
        this.genLedService.searchGen(result).subscribe(rp => {
          this.genViews = rp;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
        });

      }
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  exportData() {
    const genledSearch = {
      startDate: null,
      endDate: null,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null,
    };
    this.genLedService.exportCSV(this.exportCSV === undefined ? genledSearch : this.exportCSV);

  }
  getProfiles() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.companyAddress = rp.address;
      this.companyCode = rp.code;
    });
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.genViews.length; j++) {
      const data = {
        accNumber: this.genViews[j].accNumber,
        ledgerID: this.genViews[j].ledgerID,
        transactionType: this.genViews[j].transactionType,
        transactionNo: this.genViews[j].transactionNo,
        crspAccNumber: this.genViews[j].crspAccNumber,
        dateIssue: this.genViews[j].dateIssue,
        clientID: this.genViews[j].clientID,
        clientName: this.genViews[j].clientName,
        note: this.genViews[j].note,
        reference: this.genViews[j].reference,
        debit: this.genViews[j].debit,
        credit: this.genViews[j].credit,
        companyName: this.companyName,
        companyAddress: this.companyAddress,
        companyCode: this.companyCode,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.genViewsreport.push(data);
    }
    const reportName = 'General Journal';
    this.genLedService.GenSaveDataPrint(this.genViewsreport).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
}
