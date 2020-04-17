import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-edit-product',
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  @Input() listCategory;
  product = {
    productName: '',
    description: '',
    unitPrice: 0,
    categoryID: 0,
    categoryName: '',
    unit: '',
  };
  saving = false;
  categorySelect: any;
  categories: any;
  mes: string;

  constructor(
    injector: Injector,
    public authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
    public productService: ProductService) { super(injector); }

  ngOnInit() {
    this.productService.getProduct(this.id).subscribe(result => {
      this.product = result[0];
      if (result[0].categoryID === null) {
        this.product.categoryID = 2;
      } else {
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
        }),
      )
      .subscribe((i: any) => {
        if (i === undefined ||   i === null)  {
          this.notify.info('Update Successfully');
          this.close(true);
         }
        this.mes = i.message;
       if (this.mes === 'insert false') {
        this.message.warning('Tên hàng hóa  đã tồn tại');
       }
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
