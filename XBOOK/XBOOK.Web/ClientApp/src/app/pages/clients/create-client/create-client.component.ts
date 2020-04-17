import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ClientView } from '../../_shared/models/client/client-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../_shared/services/client.service';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-create-client',
  templateUrl: './create-client.component.html',
})
export class CreateClientComponent extends AppComponentBase implements OnInit {
  saving: false;
  client: ClientView = new ClientView();
  mes: any;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public authenticationService: AuthenticationService,
    public clientService: ClientService) {
    super(injector);
  }

  ngOnInit() {
  }
  save(): void {
    this.clientService
      .createClient(this.client)
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
        this.message.warning('Tên khách hàng  đã tồn tại');
       }

      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
