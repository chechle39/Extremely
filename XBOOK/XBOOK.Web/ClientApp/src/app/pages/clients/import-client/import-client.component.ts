import { Component, OnInit, Input, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ClientView } from '../../_shared/models/client/client-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../_shared/services/client.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-import-client',
  templateUrl: './import-client.component.html',
})
export class ImportClientComponent extends AppComponentBase implements OnInit {
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
  client: ClientView = new ClientView();
  constructor(
    injector: Injector,
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public clientService: ClientService) {
    super(injector);
  }
  @ViewChild('paramTypeSelected', { static: true }) paramTypeSelected: ElementRef;
  ngOnInit() {
    this.importForm = this.createClientFormGroup();
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
  createClientFormGroup() {
    return this.fb.group({
      clientName: [null, [Validators.required]],
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
        clientname: this.Datareport[i][this.importForm.value.clientName],
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
      if (! regex.test(client.email)) {
        invalid = true;
        this.message.warning('Sai định dạng Email dòng thứ ' + [i]);
        return;
    }
     }
    if (client.clientname !== undefined) {
      this.ImportDatareport.push(client);
    }
    }
    this.clientService
      .createImportClient(this.ImportDatareport)
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
    // tslint:disable-next-line:no-console

  }
}
