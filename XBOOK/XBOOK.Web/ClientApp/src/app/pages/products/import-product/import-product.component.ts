import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierView } from '../../_shared/models/supplier/supplier-view.model';
import { ProductService } from '../../_shared/services/product.service';
import { ProductView } from '../../_shared/models/product/product-view.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-import-product',
  templateUrl: './import-product.component.html',
})
export class ImportProductComponent extends AppComponentBase implements OnInit {
  @Input() id: any[];
  saving: false;
  public importForm: FormGroup;
  FieldName: any[] = [];
  Datareport: any[] = [];
  ImportDatareport: any[] = [];
  clientname: any;
  address: any;
  taxCode: any;
  contactName: any;
  email: any;
  bankAccount: any;
  note: any;
  SelectedFieldName: any[] = [];
  client: ProductView = new ProductView();
  constructor(
    injector: Injector,
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private productService: ProductService ) {
    super(injector);
  }

  ngOnInit() {
    this.importForm = this.createSupplierFormGroup();
    this.FieldName = this.id[0];
    this.Datareport = this.id;
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.FieldName.length; j++) {
      const data = {
        value: this.FieldName[j],
      };
      this.SelectedFieldName.push(data);
    }

  }
  createSupplierFormGroup() {
    return this.fb.group({
      productID: [null],
      productName: [null],
      description: [null],
      unitPrice: [null],
      categoryID: [null],
      Unit: [null],
    });
  }
  save(e: FormGroup): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 1; i < this.Datareport.length - 1; i++) {
      // tslint:disable-next-line:prefer-for-of
      const client = {
        productName: this.Datareport[i][this.importForm.value.productName],
        description: this.Datareport[i][this.importForm.value.description],
        unitPrice:  Number(String(this.Datareport[i][this.importForm.value.unitPrice]).replace(/,/g, '')),
        categoryID: Number(String(this.Datareport[i][this.importForm.value.categoryID]).replace(/,/g, '')),
        Unit: this.Datareport[i][this.importForm.value.Unit],
      };
      this.ImportDatareport.push(client);
    }
    this.productService
      .createImportProduct(this.ImportDatareport)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe(() => {
        this.notify.info('Saved Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
  onChange(value: string): void {
  }
}
