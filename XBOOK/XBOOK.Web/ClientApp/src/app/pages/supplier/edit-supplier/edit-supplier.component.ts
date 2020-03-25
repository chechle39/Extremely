import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierView } from '../../_shared/models/supplier/supplier-view.model';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-edit-supplier',
  templateUrl: './edit-supplier.component.html',
})
export class EditSupplierComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  client: SupplierView = new SupplierView();
  saving = false;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public authenticationService: AuthenticationService,
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
        }),
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
