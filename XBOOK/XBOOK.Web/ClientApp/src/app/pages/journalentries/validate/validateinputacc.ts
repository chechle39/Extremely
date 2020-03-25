import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl} from '@angular/forms';
import { MessageService } from '../../../coreapp/services/message.service';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateInputAccDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateInputAccDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class validateInputAccDirective implements Validator {
  @Input() rowItem: any;
  constructor(private message: MessageService) {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value.accountNumber !== undefined || control.value === '') {
      return null;
    }
    if (control.value.length > 0) {
      if (this.rowItem.filter(x => x.accountNumber === control.value.split('-')[0]).length > 0
      && this.rowItem.filter(x => x.accountName === control.value.split('-')[1]).length > 0 ) {
        return null;
      }
    }
    return { accNumber: true };
  }
}
