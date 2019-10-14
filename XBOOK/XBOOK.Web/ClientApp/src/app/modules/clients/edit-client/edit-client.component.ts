import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { ClientService } from '@modules/_shared/services/client.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-edit-client',
  templateUrl: './edit-client.component.html'
})
export class EditClientComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  client: ClientView = new ClientView();
  saving = false;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
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
