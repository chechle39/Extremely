import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '@modules/_shared/services/product.service';
import { Router } from '@angular/router';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { ProductCategory } from '@core/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { TranslateService } from '@ngx-translate/core';
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
    private productService: ProductService,
    private modalService: NgbModal,
    private router: Router,
    private cd: ChangeDetectorRef,
    private accountChartService: AccountChartService,
    private translate: TranslateService) {
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

  getAllCategory() {
    this.productService
      .getAllCategory()
      .subscribe(result => {
        this.categories = result;
      });
  }
  // edit(): void {
  //   if (this.selected.length === 0) {
  //     this.message.warning('Please select a item from the list?');
  //     return;
  //   }
  //   if (this.selected.length > 1) {
  //     this.message.warning('Only one item selected to edit?');
  //     return;
  //   }
  //   this.showCreateOrEditProductDialog(this.selected[0].categoryID, this.selected[0].productID);
  //   this.selected = [];
  // }
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
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = [];
    this.message.confirm('Do you want to delete products ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        const id = element.productID;
        requestDl.push({ id });
      });
      this.productService.deleteProduct(requestDl).subscribe((rs: any) => {
        if (rs === false) {
          this.message.error('This product can not delete');
        } else {
          this.notify.success('Successfully Deleted');
         // this.getAllProduct();
        }
      });
      this.selected = [];
    });
  }
  getRowHeight(row) {
    return row.height;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  createProduct(): void {
    this.showCreateOrEditAccountDialog();
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
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
      // if (event.cellIndex > 0) {
      //   event.cellElement.blur();
      //   this.translate.get('PRODUCT.LIST.PRODUCT')
      //     .subscribe(text => { this.productTitle = text; });
      //   this.translate.get('PRODUCT.LIST.SERVICE')
      //     .subscribe(text => { this.serviceTitle = text; });
      //   const title = event.row.categoryId === 1 ? this.productTitle : this.serviceTitle;
      //   const createOrEditProductDialog = this.modalService.open(EditProductComponent, AppConsts.modalOptionsSmallSize);
      //   createOrEditProductDialog.componentInstance.title = title;
      //   createOrEditProductDialog.componentInstance.id = event.row.productID;
      //   createOrEditProductDialog.componentInstance.listCategory = this.categories;
      //   createOrEditProductDialog.result.then(result => {
      //     if (result) {
      //       this.refresh();
      //     }
      //   });
      // }
    }
  }
}
