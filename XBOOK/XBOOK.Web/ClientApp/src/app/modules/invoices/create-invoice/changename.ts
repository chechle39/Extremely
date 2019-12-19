import { Directive, Input, ElementRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[ChangeNameDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ChangeNameDirective, multi: true }]
})

export class ChangeNameDirective implements Validator {
  @Input() rowItem: string;
  constructor(private eleRef: ElementRef) {
      debugger;
  }
  /**
   * Validate
   *
   * @param {AbstractControl} control
   * @returns {{ [key: string]: any }}
   * @memberof MinValidator
   */
  validate(control: AbstractControl): { [key: string]: any } {
    return null;
  }
}
