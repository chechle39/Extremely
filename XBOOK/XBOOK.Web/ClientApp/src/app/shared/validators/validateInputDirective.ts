import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { AppConsts } from '../../coreapp/app.consts';
import { NotifyService } from '../../coreapp/services/notify.service';
import { MessageService } from '../../coreapp/services/message.service';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateInputDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateInputDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class validateInputDirective implements Validator {
  @Input() rowItem: any;
   term: any;
  constructor(private notify: NotifyService, private message: MessageService) {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    this.term = null;
    if (this.rowItem.value.taxs.length > 1) {
      this.rowItem.value.taxs.forEach(element => {
        if (element.key !== null  && control.value !== null) {
          if (element.key.toLowerCase() === control.value.toLowerCase()) {
            this.term = 1;
            // this.message.error('Key này đã tồn tại! Vui lòng kiểm tra lại!');
          }
        }
      });
    }
  if (this.term === 1) {
    this.message.error('Key này đã tồn tại! Vui lòng kiểm tra lại!');
    return { key: true };
  } else {
    return null;
  }
}
}
