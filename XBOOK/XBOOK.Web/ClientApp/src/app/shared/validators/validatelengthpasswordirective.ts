import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateLengthPasswordDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateLengthPasswordDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class validateLengthPasswordDirective implements Validator {
  @Input() rowItem: any;
  constructor() {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value === null) {
      return null;
    }
    if (control.value.toString().length >= 6) {
      return null;
    }
    return { password: true };
  }
}
