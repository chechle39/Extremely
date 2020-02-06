import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { AppComponentBase } from '@core/app-base.component';
import { ProductService } from '@modules/_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xb-create-accountchart',
  templateUrl: './create-accountchart.component.html'
})
export class CreateAccountChartComponent extends AppComponentBase implements OnInit {

  @Input() data;
  @Input() categoryId;
  @Input() listCategory;
  public accountChartForm: FormGroup;
  saving: false;
  categories: any;
  statusCategory: any;
  product: ProductView = new ProductView();
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    public productService: ProductService) {
    super(injector);
  }

  ngOnInit() {
    this.accountChartForm = this.createAccountChartFormGroup();
    this.accountChartForm.controls.accountNumber.disable();
  }
  createAccountChartFormGroup() {

    return this.fb.group({
      accountName: ['', [Validators.required]],
      accountMethods: [null],
      accountNumber: [''],
      plusString: ['']
    });
  }

  onChange(e) {
    console.log('xxx');
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
