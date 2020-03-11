import { Component, OnInit, Input, Injector, ChangeDetectorRef } from '@angular/core';
import { CreateAccountChartComponent } from '../../accountchart/create-accountchart/create-accountchart.component';
import { AppConsts } from '../../../coreapp/app.consts';
import { AcountChartModel } from '../../_shared/models/accountchart/account-chart.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountChartService } from '../../_shared/services/accountchart.service';
import { DataService } from '../../_shared/services/data.service';
import { Router } from '@angular/router';
import { PagedListingComponentBase, PagedRequestDto } from '../../../coreapp/paged-listing-component-base';
import { MenuService } from '../../_shared/services/menu.service';
import { MenuViewModel } from '../../_shared/models/menu/menu.model';
import { FuncModel } from '../../_shared/models/menu/func.model';
class PagedProductsRequestDto extends PagedRequestDto {
  productKeyword: string;
}
@Component({
  selector: 'xb-assign-permission',
  templateUrl: './assign-permission.component.html',
  styleUrls: ['./assign-permission.component.scss'],
})
export class AssignPermissionComponent extends PagedListingComponentBase<any> implements OnInit {
  @Input() title;
  @Input() edit: boolean;
  @Input() id;
  data: FuncModel[];
  loadingIndicator = true;
  keywords = '';
  reorderable = true;
  ColumnMode = ColumnMode;
  genledSearch: { startDate: any; endDate: any; isaccount: any; isAccountReciprocal: any; money: any; accNumber: any; };
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private accountChartService: AccountChartService,
    private senData: DataService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private menuService: MenuService,
    ) {
    super(injector);
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
    this.menuService.getAllFunction().subscribe(rp => {
      this.data = rp.map(i => {
        if (i.parentId === null) {
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
      const data = this.data.filter(x => x.id === event.id);
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
      parentAccNumber: this.data.filter(x => x.id === row.parentAccount)[0].id,
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
      this.router.navigate([`/pages/genledgroup`]);

    }
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
