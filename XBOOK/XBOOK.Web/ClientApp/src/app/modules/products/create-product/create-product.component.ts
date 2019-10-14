import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { AppComponentBase } from '@core/app-base.component';
import { ProductService } from '@modules/_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { ProductCategory } from '@modules/_shared/models/product/product-category.model';

@Component({
  selector: 'xb-create-product',
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() categoryId;
  saving: false;
  categories = [
    new ProductCategory(1, 'Hàng Hóa'),
    new ProductCategory(2, 'Dịch Vụ')
  ];
  product: ProductView = new ProductView();
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public productService: ProductService) {
    super(injector);
  }

  ngOnInit() {
  }
  save(): void {
    this.product.categoryId = this.categoryId;
    this.product.unitPrice = Number(this.product.unitPrice.toString().replace(/,/g, ''));
    this.productService
      .createProduct(this.product)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Saved Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
