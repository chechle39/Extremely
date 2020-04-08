import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, Subject, merge, of, Subscription, Observer } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { AccountBalanceService } from '../_shared/services/accountbalance.service';
import { GenLedGroupService } from '../_shared/services/genledgroup.service';
import { Router } from '@angular/router';
import { InvoiceService } from '../_shared/services/invoice.service';
import { ClientView } from '../_shared/models/client/client-view.model';
import { AccountBalanceView } from '../_shared/models/accountbalance/accountbalance-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { SearchaccountbalanceComponent } from './searchaccountbalance/searchgenled.component';
import * as _ from 'lodash';
import { SearchType, ActionType } from '../../coreapp/app.enums';
import { DataService } from '../_shared/services/data.service';
import { CommonService } from '../../shared/service/common.service';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-accountbalance',
  templateUrl: './accountbalance.component.html',
  styleUrls: ['./accountbalance.component.scss'],
})
export class AccountbalanceComponent extends PagedListingComponentBase<ClientView> {
  genViews: any;
  genViewsTemp: any;
  accountBalanceViews: any;
  accountBalanceViewsreport: any[] = [];
  endDay: any;
  accountBalanceViews1: AccountBalanceView[];
  sumdebitOpening: any;
  startDay: any;
  firstDate: any;
  endDate1: string;
  keyspace: any;
  Currency: any;
  companyName: string;
  companyAddress: string;
  companyCode: string;
  taxCode: string;
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  reorderable = true;
  selected = [];
  case: any;
  protected delete(id: number): void {
    throw new Error('Method not implemented.');
  }
  constructor(
    injector: Injector,
    private data: DataService,
    private accountBalanceService: AccountBalanceService,
    private genLedService: GenLedGroupService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private invoiceService: InvoiceService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Account Balance');
  }

  getRowHeight(row) {
    return row.height;
  }
  // Sum
  public getdebitOpeningTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.debitOpening;
    });
  }

  public getcreditOpeningTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.creditOpening;
    });
  }

  public getdebitTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.debit;
    });
  }

  public getcreditTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.credit;
    });
  }

  public getdebitClosingTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.debitClosing;
    });
  }

  public getcreditClosingTotal(): number {
    return _.sumBy(this.accountBalanceViews1, item => {
      return item.creditClosing;
    });
  }

  //
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    const date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    this.loadingIndicator = true;
    const genledSearch = {
       startDate: this.firstDate === undefined ? null : this.firstDate,
      endDate: this.endDate1 === undefined ? null : this.endDate1,
      money: null,
    };
    this.
      accountBalanceService.getAccountBalanceViewModelData(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.accountBalanceViews = i;
        this.accountBalanceViews1 = this.accountBalanceViews;
        this.getdebitOpeningTotal();
        this.getcreditOpeningTotal();
        this.getdebitTotal();
        this.getcreditTotal();
        this.getdebitClosingTotal();
        this.getcreditClosingTotal();
      });
    this. getProfiles();
  }



  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchaccountbalanceComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {
        const genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          money: result.money,        
        };
        this.accountBalanceService.getAccountBalanceViewModelData(genledSearch).subscribe(rp => {
          this.accountBalanceViews = rp;
          this.accountBalanceViews1 = this.accountBalanceViews;
          this.getdebitOpeningTotal();
          this.getcreditOpeningTotal();
          this.getdebitTotal();
          this.getcreditTotal();
          this.getdebitClosingTotal();
          this.getcreditClosingTotal();
        });
        this.case = result.case;
        this.startDay = result.startDate;
        this.endDay = result.endDate;
      }

      this.keyspace = ' - ';
    });
  }
  getProfiles() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.taxCode = rp.taxCode;
      this.companyAddress = rp.address;
      this.companyCode = rp.code;
    });
  }
  Print() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.accountBalanceViews1.length; i++) {
      const data = {
        companyName : this.companyName,
        companyAddress : this.companyAddress,
        companyCode: this.companyCode,
        accName: this.accountBalanceViews1[i].accName,
        accNumber: this.accountBalanceViews1[i].accNumber,
        creditOpening: this.accountBalanceViews1[i].creditOpening,
        debitOpening: this.accountBalanceViews1[i].debitOpening,
        credit: this.accountBalanceViews1[i].credit,
        debit: this.accountBalanceViews1[i].debit,
        creditClosing: this.accountBalanceViews1[i].creditClosing,
        debitClosing: this.accountBalanceViews1[i].debitClosing,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.accountBalanceViewsreport.push(data);
    }

    const reportName = 'Account Balance';
    this.accountBalanceService.AccountBalanceSaveDataPrint(this.accountBalanceViewsreport).subscribe(rp => {
      this.router.navigate([`/pages/print/${reportName}`]);
    });
  }
  getaccNumber(id) {
    if( id !== null || id !==undefined){
      const data = {
        accNumber: id,
        case: this.case,
        startDate: this.startDay === undefined ? this.firstDate : this.startDay,
        endDate: this.endDay === undefined ? this.endDate1 : this.endDay,
      };
      this.data.sendMessage(data);
      this.router.navigate([`/pages/generalledger/${id}`]);
    }  
   
  }
}



