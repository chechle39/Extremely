import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { ClientService } from '@modules/_shared/services/client.service';
import { finalize } from 'rxjs/operators';
import { SupplierService } from '@modules/_shared/services/supplier.service';
import { SupplierView } from '@modules/_shared/models/supplier/supplier-view.model';

@Component({
  selector: 'xb-edit-supplier',
  templateUrl: './edit-supplier.component.html'
})
export class EditSupplierComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  client: SupplierView = new SupplierView();
  saving = false;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private supplierService: SupplierService) { super(injector); }

  ngOnInit() {
    this.supplierService.getSupplier(this.id).subscribe(result => {
      this.client = result;
    });
  }
  save(): void {
    this.supplierService
      .updateSupplier(this.client)
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
