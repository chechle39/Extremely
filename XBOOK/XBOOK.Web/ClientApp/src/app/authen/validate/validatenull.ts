import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateNullDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateNullDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class validateNullDirective implements Validator {
  @Input() rowItem: any;
  constructor() {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value !== null) {
      return null;
    }
    return { userName: true };
  }
}
