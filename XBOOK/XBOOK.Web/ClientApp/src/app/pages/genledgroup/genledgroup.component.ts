import { Component, Injector } from '@angular/core';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { SearchgenledComponent } from './searchgenledgroup/searchgenled.component';
import { GenLedGroupService } from '../_shared/services/genledgroup.service';
import { AccountBalanceService } from '../_shared/services/accountbalance.service';
import { GenLedService } from '../_shared/services/genled.service';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountBalanceViewModel } from '../_shared/models/accountbalance/accountbalance-view.model';
import { InvoiceService } from '../_shared/services/invoice.service';
import { DataService } from '../_shared/services/data.service';

class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-genled',
  templateUrl: './genledgroup.component.html',
  styleUrls: ['./genledgroup.component.scss']
})
export class GenledgroupComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  companyName: any;
  companyAddress: any;
  companyCode: string;
  taxCode: string;
  genViewsrequst: any[] = [];
  fromDate: any;
  firstDate: any;
  endDate1: string;
  tempaccount: any;
  requestSaveJson: any[] = [];
  case: any;
  genViews: any;
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
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    public accountChartService: AccountChartService,
    public accountBalanceService: AccountBalanceService,
    private genLedService: GenLedGroupService,
    private genLedreportService: GenLedService,
    private data: DataService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }

  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {

    const genledSearch = this.getParam();
  }


  private getParam() {
    const date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    this.data.getMessage().subscribe(rpp => {
      console.log(rpp);
      if (rpp === undefined) {
        const genledSearch = {
          startDate: this.firstDate === undefined ? null : this.firstDate,
          endDate: this.endDate1 === undefined ? null : this.endDate1,
          isaccount: false,
          isAccountReciprocal: false,
          money: null,
          accNumber: null
        };
        this.invoiceService.getInfoProfile().subscribe((r: any) => {
          this.companyName = r.companyName;
          this.taxCode = r.taxCode;
          this.companyAddress = r.address;
          this.companyCode = r.code;
        });
        this.accountChartService.searchAcc().subscribe(rp => {
          this.tempaccount = rp;
        });
        this.genLedService
          .searchGen(genledSearch)
          .pipe(
          )
          .subscribe(i => {
            this.loadingIndicator = false;
            this.genViews = i;
            const data = [];
            this.genViewsTemp = data;
            this.methodEdit_View();
          });

        this.genLedreportService
          .searchGen(genledSearch)
          .pipe(
            // debounceTime(500),
          )
          .subscribe(i => {
            this.loadingIndicator = false;
            this.genViewsreport = i;
          });
       // return genledSearch;
      } else {
        const genledSearch = {
          startDate: rpp.data.start,
          endDate: rpp.data.end,
          isaccount: true,
          isAccountReciprocal: false,
          money: null,
          accNumber: [rpp.data.accNumber]
        };
        this.invoiceService.getInfoProfile().subscribe((r: any) => {
          this.companyName = r.companyName;
          this.taxCode = r.taxCode;
          this.companyAddress = r.address;
          this.companyCode = r.code;
        });
        this.accountChartService.searchAcc().subscribe(rp => {
          this.tempaccount = rp;
        });
        this.genLedService
          .searchGen(genledSearch)
          .pipe(

          )
          .subscribe(i => {
            this.loadingIndicator = false;
            this.genViews = i;
            const data = [];
            this.genViewsTemp = data;
            this.methodEdit_View();
          });

        this.genLedreportService
          .searchGen(genledSearch)
          .pipe(
          )
          .subscribe(i => {
            this.loadingIndicator = false;
            this.genViewsreport = i;
          });
      }
    });
   // return genledSearch;
  }

  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchgenledComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {
        const genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          isaccount: result.isaccount,
          isAccountReciprocal: result.accountReciprocal,
          money: result.money,
          accNumber: result.accNumber,
        };
        this.exportCSV = result;
        this.genLedService.searchGen(genledSearch).subscribe(rp => {
          this.genViews = rp;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
        });
        this.genLedreportService.searchGen(genledSearch).subscribe(rp => {
          this.genViewsreport = rp;
          this.case = result.case;
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
        });
      }
    });

  }

  methodEdit_View() {
    this.activeRoute.params.subscribe(params => {
      if (!isNaN(params.key)) {
        const genledSearch = {
          startDate: this.firstDate === undefined ? null : this.firstDate,
          endDate: this.endDate1 === undefined ? null : this.endDate1,
          isaccount: true,
          isAccountReciprocal: false,
          money: null,
          accNumber: [params.key]
        };
        this.genLedService.searchGen(genledSearch).subscribe(rp => {
          this.loadingIndicator = false;
          this.genViews = rp;
          const data = [];
          this.genViewsTemp = data;
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
      accNumber: null
    };
    this.genLedService.exportCSV(this.exportCSV === undefined ? genledSearch : this.exportCSV);

  }
  Print() {
    if (this.genViews.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.genViews.length; i++) {
        const genledSearch = {
          startDate: null,
          endDate: null,
          money: null,
          accountNumber: this.genViews[i].accNumber,
        };
        this.accountBalanceService.getAccountBalanceAccountViewModelData(genledSearch).subscribe(rp => {
          this.genViewsrequst[i] = rp;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.genViewsreport.length; j++) {
            if (this.genViews[i].accNumber === this.genViewsreport[j].accNumber && this.genViewsreport[j].accNumber !== undefined) {
              const data = {
                companyName: i !== undefined ? this.companyName : null,
                companyAddress: i !== undefined ? this.companyAddress : null,
                accNumber: this.genViewsreport[j].accNumber,
                ledgerID: this.genViewsreport[j].ledgerID,
                transactionType: this.genViewsreport[j].transactionType,
                transactionNo: this.genViewsreport[j].transactionNo,
                crspAccNumber: this.genViewsreport[j].crspAccNumber,
                dateIssue: this.genViewsreport[j].dateIssue,
                clientID: this.genViewsreport[j].clientID,
                clientName: this.genViewsreport[j].clientName,
                note: this.genViewsreport[j].note,
                reference: this.genViewsreport[j].reference,
                debit: this.genViewsreport[j].debit,
                credit: this.genViewsreport[j].credit,
                AccountBalanceViewModel: this.genViewsrequst[i],
              };
              this.requestSaveJson.push(data);
            }
          }
          const reportName = 'GeneralLedgerReport';
          this.genLedService.GenGroupSaveDataPrint(this.requestSaveJson).subscribe(rp1 => {
            this.router.navigate([`/pages/print/${reportName}`]);
          });
        });
      }
    }
  }
}

