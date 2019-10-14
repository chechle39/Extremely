import { Component, OnInit, Injector } from '@angular/core';
import { ProductService } from '@modules/_shared/services/product.service';
import { Router } from '@angular/router';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { ProductCategory } from '@core/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProductComponent } from './create-product/create-product.component';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { EditProductComponent } from './edit-product/edit-product.component';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
class PagedProductsRequestDto extends PagedRequestDto {
  keywords: string;
}
@Component({
  selector: 'xb-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent extends PagedListingComponentBase<ProductView> {
  productViews: ProductView[] = [];
  loadingIndicator = false;
  keywords = '';
  reorderable = true;
  selected = [];
  productTitle = '';
  serviceTitle = '';
  ColumnMode = ColumnMode;
  ProductCategory = ProductCategory;
  SelectionType = SelectionType;
  constructor(
    injector: Injector,
    private productService: ProductService,
    private modalService: NgbModal,
    private router: Router,
    private translate: TranslateService) {
    super(injector);
  }
  protected list(
    request: PagedProductsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {

    request.keywords = this.keywords;
    this.loadingIndicator = true;
    this.productService
      .getAll(request.keywords)
      .pipe(
        debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      // .subscribe((result: PagedResultDtoOfUserDto) => {
      //   this.users = result.items;
      //   this.showPaging(result, pageNumber);
      // });
      .subscribe(i => {
        this.loadingIndicator = false;
        this.productViews = i;
      });
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
    this.showCreateOrEditProductDialog(this.selected[0].category, this.selected[0].id);
    this.selected = [];
  }
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    this.message.confirm('Do you want to delete products ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        this.productService.deleteProduct(element.id).subscribe(() => {
          this.notify.success('Successfully Deleted');
          this.refresh();
        });
      });
      this.selected = [];
    });
  }
  getRowHeight(row) {
    return row.height;
  }
  createProduct(category: ProductCategory): void {
    this.showCreateOrEditProductDialog(category);
  }
  showCreateOrEditProductDialog(category: ProductCategory, id?: number): void {
    let createOrEditProductDialog;
    this.translate.get('PRODUCT.LIST.PRODUCT')
      .subscribe(text => { this.productTitle = text; });
    this.translate.get('PRODUCT.LIST.SERVICE')
      .subscribe(text => { this.serviceTitle = text; });
    const title = category === ProductCategory.product ? this.productTitle : this.serviceTitle;
    if (id === undefined || id <= 0) {
      createOrEditProductDialog = this.modalService.open(CreateProductComponent, AppConsts.modalOptionsSmallSize);
      createOrEditProductDialog.componentInstance.title = title;
      createOrEditProductDialog.componentInstance.categoryId = category;
    } else {
      createOrEditProductDialog = this.modalService.open(EditProductComponent, AppConsts.modalOptionsSmallSize);
      createOrEditProductDialog.componentInstance.title = title;
      createOrEditProductDialog.componentInstance.id = id;
    }
    createOrEditProductDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click' && event.value !== '') {
      event.cellElement.blur();
      this.translate.get('PRODUCT.LIST.PRODUCT')
        .subscribe(text => { this.productTitle = text; });
      this.translate.get('PRODUCT.LIST.SERVICE')
        .subscribe(text => { this.serviceTitle = text; });
      const title = event.row.categoryId === 1 ? this.productTitle : this.serviceTitle;
      const createOrEditProductDialog = this.modalService.open(EditProductComponent, AppConsts.modalOptionsSmallSize);
      createOrEditProductDialog.componentInstance.title = title;
      createOrEditProductDialog.componentInstance.id = event.row.id;
      createOrEditProductDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
    }
  }
}
