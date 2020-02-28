import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '../../_shared/models/product/product-view.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ProductService } from '../../_shared/services/product.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-create-product',
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() categoryId;
  @Input() listCategory;
  saving: false;
  categories: any;
  statusCategory: any;
  product: ProductView = new ProductView();
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public productService: ProductService) {
    super(injector);
  }

  ngOnInit() {
    this.categories = this.listCategory;
    this.statusCategory = this.categoryId;
  }
  save(): void {
    this.product.categoryId = this.statusCategory;
    this.product.unitPrice = Number(String(this.product.unitPrice).replace(/,/g, ''));
    if (this.product.productName !== 'undefined' && this.product.productName != null) {
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
    } else {
      this.notify.error('Error');
    }
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
