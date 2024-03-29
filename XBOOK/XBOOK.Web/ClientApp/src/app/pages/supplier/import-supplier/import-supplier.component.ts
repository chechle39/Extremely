import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierView } from '../../_shared/models/supplier/supplier-view.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-import-supplier',
  templateUrl: './import-supplier.component.html',
})
export class ImportSupplierComponent extends AppComponentBase implements OnInit {
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
  client: SupplierView = new SupplierView();
  constructor(
    injector: Injector,
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private supplierService: SupplierService ) {
    super(injector);
  }

  ngOnInit() {
    this.importForm = this.createSupplierFormGroup();
    this.FieldName = this.id[0];
    this.Datareport = this.id;
    // tslint:disable-next-line:prefer-for-of
    for (let j = 1; j < this.FieldName.length; j++) {
      if (this.FieldName[j] !== '' ) {
      const data = {
        value: this.FieldName[j],
      };
      if (data !== null || data !== undefined) {
        this.SelectedFieldName.push(data);
      }
    }
    }

  }
  createSupplierFormGroup() {
    return this.fb.group({
      supplierName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      contactName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      bankAccount: [null],
      note: [null],
    });
  }
  save(e: FormGroup): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 1; i < this.Datareport.length - 1; i++) {
      // tslint:disable-next-line:prefer-for-of
      const client = {
        supplierName: this.Datareport[i][this.importForm.value.supplierName],
        address: this.Datareport[i][this.importForm.value.address],
        taxCode: this.Datareport[i][this.importForm.value.taxCode],
        contactName: this.Datareport[i][this.importForm.value.contactName],
        email: this.Datareport[i][this.importForm.value.email],
        bankAccount: this.Datareport[i][this.importForm.value.bankAccount],
        note: this.Datareport[i][this.importForm.value.note],
      };
      let invalid = false;
      // tslint:disable-next-line:max-line-length
      const regex = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      if (client.email !== undefined) {
        if ( client.email === '' || ! regex.test(client.email)) {
          invalid = true;
          this.message.warning('Sai định dạng Email dòng thứ ' + [i]);
          return;
      }
      }
      this.ImportDatareport.push(client);
    }
    this.supplierService
      .createImportSupplier(this.ImportDatareport)
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
