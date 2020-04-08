import {
  Component,
  Injector,
  ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {
  PagedListingComponentBase,
  PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { AccountChartService } from '../_shared/services/accountchart.service';
import { CreateAccountChartComponent } from './create-accountchart/create-accountchart.component';
import { AcountChartModel } from '../_shared/models/accountchart/account-chart.model';
import { DataService } from '../_shared/services/data.service';
import { Router } from '@angular/router';
import { SearchgenledComponent } from '../genledgroup/searchgenledgroup/searchgenled.component';
import { AuthenticationService } from '../../coreapp/services/authentication.service';
import { CommonService } from '../../shared/service/common.service';
class PagedProductsRequestDto extends PagedRequestDto {
  productKeyword: string;
}
@Component({
  selector: 'xb-accountchart',
  templateUrl: './accountchart.component.html',
  styleUrls: ['./accountchart.component.scss'],
})
export class AccountChartComponent extends PagedListingComponentBase<any> {
  data: AcountChartModel[];
  loadingIndicator = true;
  keywords = '';
  reorderable = true;
  ColumnMode = ColumnMode;
  genledSearch: { startDate: any; endDate: any; isaccount: any; isAccountReciprocal: any; money: any; accNumber: any; };
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    public authenticationService: AuthenticationService,
    private accountChartService: AccountChartService,
    private commonService: CommonService,
    private senData: DataService,
    private router: Router,
    ) {
    super(injector);
    this.commonService.CheckAssessFunc('Account Chart');
  }

  protected list(
    request: PagedProductsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    request.productKeyword = this.keywords;
    this.loadingIndicator = true;
    this.getAllAcc();
  }
  getAllAcc() {
    this.accountChartService.searchAccTree().subscribe(rp => {
      this.data = rp.map(i => {
        if (i.isParent === true) {
          i.treeStatus = 'expanded';
        } else {
          i.treeStatus = 'loading';
        }
        return i;
      });
      this.loadingIndicator = false;
    });
  }


  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
     // row.treeStatus = 'loading';
      row.treeStatus = 'expanded';
      const data = this.data.filter(x => x.parentAccount === event.accountNumber);
      this.data = [...this.data, ...data];
      this.cd.detectChanges();
    } else if (row.treeStatus === 'loading') {

    } else {
      row.treeStatus = 'collapsed';

      this.data = [...this.data];
      this.cd.detectChanges();
    }
  }

  deleteAccount(row) {
    const rs = {
      accNumber: row.accountNumber,
      parentAccNumber: this.data.filter(x => x.accountNumber === row.parentAccount)[0].accountNumber,
    };
    this.message.confirm('Do you want to delete acount chart ?', 'Are you sure ?', () => {
      this.accountChartService.deleteAccount(rs).subscribe(rp => {
        if (rp === false) {
          this.message.error('This account can not delete');
        } else {
          this.notify.success('Successfully Deleted');
          this.getAllAcc();
        }
      });
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  onSelect({ selected }) {
  }


  showCreateOrEditAccountDialog(): void {
    let createOrEditAccountDialog;
    createOrEditAccountDialog = this.modalService.open(CreateAccountChartComponent, AppConsts.modalOptionsSmallSize);
    createOrEditAccountDialog.componentInstance.data = this.data;

    createOrEditAccountDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
  editAccount(row, event) {
    event.target.parentElement.parentElement.blur();
    event.target.closest('datatable-body-cell').blur();
    let createOrEditAccountDialog;
    createOrEditAccountDialog = this.modalService.open(CreateAccountChartComponent, AppConsts.modalOptionsSmallSize);
    createOrEditAccountDialog.componentInstance.row = row;
    createOrEditAccountDialog.componentInstance.data = this.data;

    createOrEditAccountDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'dblclick' && event.cellIndex !== 4 && event.cellIndex !== 0) {
      event.cellElement.blur();
      if (this.genledSearch === undefined) {
        const rs  = {
          start: null,
          end: null,
          accNumber: event.row.accountNumber,
        };
        this.senData.sendMessage(rs);

      } else {
        const rs  = {
          start: this.genledSearch.startDate,
          end: this.genledSearch.endDate,
          accNumber: event.row.accountNumber,
        };
        this.senData.sendMessage(rs);

      }
      this.router.navigate([`/pages/generalledger`]);

    }
  }

  SearchGenLed() {
    const dialog = this.modalService.open(SearchgenledComponent, AppConsts.modalOptionsCustomSize);
    dialog.componentInstance.accChart = 1;
    dialog.result.then(result => {
      if (result) {
        this.genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          isaccount: result.isaccount,
          isAccountReciprocal: result.accountReciprocal,
          money: result.money,
          accNumber: result.accNumber,
        };
      }
    });
  }
}
