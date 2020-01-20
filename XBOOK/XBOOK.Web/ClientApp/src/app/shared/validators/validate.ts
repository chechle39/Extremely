import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateDirective, multi: true }]
})

// tslint:disable-next-line:class-name
export class validateDirective implements Validator {
  @Input() rowItem: string;

  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value.toString().split(',').length === 1) {
      if (this.rowItem < control.value) {
        return { amount: true };
      }
    } else {
      if (this.rowItem < control.value.split(',').join('')) {
        return { amount: true };
      }
    }

    return null;
  }
}
