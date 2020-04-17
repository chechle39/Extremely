import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ClientView } from '../../_shared/models/client/client-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierView } from '../../_shared/models/supplier/supplier-view.model';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-create-supplier',
  templateUrl: './create-supplier.component.html',
})
export class CreateSupplierComponent extends AppComponentBase implements OnInit {
  saving: false;
  client: SupplierView = new SupplierView();
  mes: any;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private supplierService: SupplierService,
    public authenticationService: AuthenticationService,
   ) {
    super(injector);
  }

  ngOnInit() {
  }
  save(): void {
    this.supplierService
      .createSupplier(this.client)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((i: any) => {
        if (i === undefined ||   i === null)  {
          this.notify.info('Saved Successfully');
          this.close(true);
         }
        this.mes = i.message;
       if (this.mes === 'insert false') {
        this.message.warning('Tên nhà cung cấp  đã tồn tại');
       }

      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
