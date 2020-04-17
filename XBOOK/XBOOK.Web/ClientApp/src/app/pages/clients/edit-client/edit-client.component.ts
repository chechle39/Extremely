import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientView } from '../../_shared/models/client/client-view.model';
import { ClientService } from '../../_shared/services/client.service';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';

@Component({
  selector: 'xb-edit-client',
  templateUrl: './edit-client.component.html',
})
export class EditClientComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  client: ClientView = new ClientView();
  saving = false;
  mes: any;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public authenticationService: AuthenticationService,
    public clientService: ClientService) { super(injector); }

  ngOnInit() {
    this.clientService.getClient(this.id).subscribe(result => {
      this.client = result;
    });
  }
  save(): void {
    this.clientService
      .updateClient(this.client)
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
        this.message.warning('Tên khách hàng  đã tồn tại');
       }
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
