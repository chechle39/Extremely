import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[validateDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateDirective, multi: true }]
})

export class validateDirective implements Validator {
  @Input() rowItem: string;

  /**
   * Validate
   *
   * @param {AbstractControl} control
   * @returns {{ [key: string]: any }}
   * @memberof MinValidator
   */
  validate(control: AbstractControl): { [key: string]: any } {
    if (this.rowItem <  control.value.split(',').join('')) {
        return {amount: true};
    }
    return null;
  }
}
