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
  productKeyword: string;
}
@Component({
  selector: 'xb-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent extends PagedListingComponentBase<ProductView> {
  productViews: any;
  categories : any;
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
    this.getAllProduct();
    this.getAllCategory();
  }
  getAllProduct(){
    const request  = {
      productKeyword: this.keywords.toLocaleLowerCase(),
      isGrid: true
    };
    this.productService
    .searchProduct(request)
    .pipe(
    )
    .subscribe(i => {
      this.loadingIndicator = false;
      this.productViews = i;
    });
  }

  getAllCategory(){
    this.productService
    .getAllCategory()
    .subscribe(result => {
      this.categories = result
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
    this.showCreateOrEditProductDialog(this.selected[0].categoryID, this.selected[0].productID);
    this.selected = [];
  }
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = []
    this.message.confirm('Do you want to delete products ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        const id = element.productID;
        requestDl.push({id});
      });
      this.productService.deleteProduct(requestDl).subscribe((rs: any) => {
        if (rs === false){
          this.message.error('This product can not delete');
        }
        else{
          this.notify.success('Successfully Deleted');
          this.getAllProduct();
        }
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
  showCreateOrEditProductDialog(category: ProductCategory, productID?: number): void {
    let createOrEditProductDialog;
    this.translate.get('PRODUCT.LIST.PRODUCT')
      .subscribe(text => { this.productTitle = text; });
    this.translate.get('PRODUCT.LIST.SERVICE')
      .subscribe(text => { this.serviceTitle = text; });
    const title = category === ProductCategory.product ? this.productTitle : this.serviceTitle;
    if (productID === undefined || productID <= 0) {
      createOrEditProductDialog = this.modalService.open(CreateProductComponent, AppConsts.modalOptionsSmallSize);
      createOrEditProductDialog.componentInstance.title = title;
      createOrEditProductDialog.componentInstance.categoryId = category;
      createOrEditProductDialog.componentInstance.listCategory = this.categories;
    } else {
      createOrEditProductDialog = this.modalService.open(EditProductComponent, AppConsts.modalOptionsSmallSize);
      createOrEditProductDialog.componentInstance.title = title;
      createOrEditProductDialog.componentInstance.id = productID;
      createOrEditProductDialog.componentInstance.listCategory = this.categories;
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
    if (event.type === 'click') {
      if (event.cellIndex > 0) {
        event.cellElement.blur();
        this.translate.get('PRODUCT.LIST.PRODUCT')
          .subscribe(text => { this.productTitle = text; });
        this.translate.get('PRODUCT.LIST.SERVICE')
          .subscribe(text => { this.serviceTitle = text; });
        const title = event.row.categoryId === 1 ? this.productTitle : this.serviceTitle;
        const createOrEditProductDialog = this.modalService.open(EditProductComponent, AppConsts.modalOptionsSmallSize);
        createOrEditProductDialog.componentInstance.title = title;
        createOrEditProductDialog.componentInstance.id = event.row.productID;
        createOrEditProductDialog.componentInstance.listCategory = this.categories;
        createOrEditProductDialog.result.then(result => {
          if (result) {
            this.refresh();
          }
        });
      }
    }
  }
}
