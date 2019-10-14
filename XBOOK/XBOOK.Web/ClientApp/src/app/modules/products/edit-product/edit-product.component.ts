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
  product: ProductView = new ProductView();
  saving = false;
  categories = [
    new ProductCategory(1, 'Hàng Hóa'),
    new ProductCategory(2, 'Dịch Vụ')
  ];
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public productService: ProductService) { super(injector); }

  ngOnInit() {
    this.productService.getProduct(this.id).subscribe(result => {
      this.product = result;
    });
  }
  save(): void {
    this.product.unitPrice = Number(this.product.unitPrice.toString().replace(/,/g, ''));
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
