import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ClientView } from '../../_shared/models/client/client-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../_shared/services/client.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-create-client',
  templateUrl: './create-client.component.html'
})
export class CreateClientComponent extends AppComponentBase implements OnInit {
  saving: false;
  client: ClientView = new ClientView();
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
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
        })
      )
      .subscribe(() => {
        this.notify.info('Saved Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
