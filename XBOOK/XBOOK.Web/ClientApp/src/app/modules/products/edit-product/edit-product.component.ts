import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { ProductService } from '@modules/_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@core/app-base.component';
import { ProductCategory } from '@modules/_shared/models/product/product-category.model';

@Component({
  selector: 'xb-edit-product',
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  @Input() listCategory;
  product= {
    productName: '',
    description: '',
    unitPrice: 0,
    categoryID: 0,
    categoryName: '',
  };
  saving = false;
  categorySelect: any;
  categories: any;

  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public productService: ProductService) { super(injector); }

  ngOnInit() {
    this.productService.getProduct(this.id).subscribe(result => {
      this.product = result[0];
      if(result[0].categoryID === null){
        this.product.categoryID = 2;
      }
      else{
        this.productService.getCategory(result[0].categoryID).subscribe(rs => {
          this.categories = rs;
        });
      }

    });
    this.categorySelect = this.listCategory;
  }
  save(): void {
    this.product.unitPrice = Number(String(this.product.unitPrice).replace(/,/g, ''));
    this.productService
      .updateProduct(this.product)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Update Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
