import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { ProductCategory } from '@core/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import { CreateAccountChartComponent } from './create-accountchart/create-accountchart.component';
import { AcountChartModel } from '@modules/_shared/models/accountchart/account-chart.model';
class PagedProductsRequestDto extends PagedRequestDto {
  productKeyword: string;
}
@Component({
  selector: 'xb-accountchart',
  templateUrl: './accountchart.component.html',
  styleUrls: ['./accountchart.component.scss']
})
export class AccountChartComponent extends PagedListingComponentBase<ProductView> {
  data: AcountChartModel[];
  productViews: any;
  categories: any;
  loadingIndicator = true;
  keywords = '';
  reorderable = true;
  selected = [];
  productTitle = '';
  serviceTitle = '';
  ColumnMode = ColumnMode;
  ProductCategory = ProductCategory;
  SelectionType = SelectionType;
  productKey = {
    productKeyword: ''
  };
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private accountChartService: AccountChartService,
    ) {
    super(injector);
  }

  protected list(
    request: PagedProductsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    request.productKeyword = this.keywords;
    this.loadingIndicator = true;
    this.getAllAcc();
  }
  getAllAcc() {
    this.accountChartService.searchAccTree().subscribe(rp => {
      this.data = rp.map(i => {
        i.treeStatus = 'expanded';
        return i;
      });
      this.loadingIndicator = false;
    });
  }


  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';
      row.treeStatus = 'expanded';
      const data = this.data.filter(x => x.parentAccount === event.accountNumber);
      this.data = [...this.data, ...data];
      this.cd.detectChanges();
    } else {
      row.treeStatus = 'collapsed';

      this.data = [...this.data];
      this.cd.detectChanges();
    }
  }

  deleteAccount(row) {
    const rs = {
      accNumber: row.accountNumber
    };
    this.accountChartService.deleteAccount(rs).subscribe(rp => {
      if (rp === false) {
        this.message.error('This account can not delete');
      } else {
        this.notify.success('Successfully Deleted');
        this.refresh();
      }
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
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
    if (event.type === 'click' && event.cellIndex !== 4 && event.cellIndex !== 0) {
      event.cellElement.blur();
      let createOrEditAccountDialog;
      createOrEditAccountDialog = this.modalService.open(CreateAccountChartComponent, AppConsts.modalOptionsSmallSize);
      createOrEditAccountDialog.componentInstance.row = event.row;
      createOrEditAccountDialog.componentInstance.data = this.data;
      createOrEditAccountDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
      console.log('xx');
    }
  }

  SearchGenLed() {

  }
}
