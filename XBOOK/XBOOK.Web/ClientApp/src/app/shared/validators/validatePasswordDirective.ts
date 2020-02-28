import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl} from '@angular/forms';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validatePasswordDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validatePasswordDirective, multi: true }]
})

// tslint:disable-next-line:class-name
export class validatePasswordDirective implements Validator {
  @Input() rowItem: any;
  constructor() {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    if (this.rowItem.value.password === control.value) {
      return null;
    }
    return { passwordCF: true };
  }
}
