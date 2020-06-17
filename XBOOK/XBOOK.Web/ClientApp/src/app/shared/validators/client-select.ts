import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { NotifyService } from '../../coreapp/services/notify.service';
import { MessageService } from '../../coreapp/services/message.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[clientSelectDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: clientSelectDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class clientSelectDirective implements Validator {
  @Input() rowItem: any;
  constructor(private notify: NotifyService, private message: MessageService) {

  }
  validate(control: AbstractControl): { [key: string]: any } {
      if (this.rowItem.clientId.value === 0) {
        return { clientName: true };
      }
    return null;
  }
}
