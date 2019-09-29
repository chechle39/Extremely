import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-confirm',
  templateUrl: 'dialog-confirm.component.html',
  styleUrls: ['dialog-confirm.component.scss'],
})
export class DialogConfirmComponent {

  @Input() title: string;
  @Input() content: string;

  constructor(protected ref: NbDialogRef<DialogConfirmComponent>) {
  }

  cancel() {
    this.ref.close(0);
  }

  ok() {
    this.ref.close(1);
  }
}
