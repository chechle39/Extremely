import { Directive, Input, Inject } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { NotifyService } from '../../coreapp/services/notify.service';
import { MessageService } from '../../coreapp/services/message.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateDateDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: validateDateDirective, multi: true }],
})

// tslint:disable-next-line:class-name
export class validateDateDirective implements Validator {
  @Input() rowItem: any;
  constructor(private notify: NotifyService, private message: MessageService) {

  }
  validate(control: AbstractControl): { [key: string]: any } {
    if (this.rowItem.issueDate.value !== null) {
      const issueDate = [this.rowItem.issueDate.value.year,
      this.rowItem.issueDate.value.month,
      this.rowItem.issueDate.value.day].join('-') === '--' ? '' : [this.rowItem.issueDate.value.year,
      this.rowItem.issueDate.value.month, this.rowItem.issueDate.value.day].join('-');
      const dueDate = [this.rowItem.dueDate.value.year,
      this.rowItem.dueDate.value.month,
      this.rowItem.dueDate.value.day].join('-') === '--' ? '' : [this.rowItem.dueDate.value.year,
      this.rowItem.dueDate.value.month, this.rowItem.dueDate.value.day].join('-');

      const a = new Date(issueDate);
      const b = new Date(dueDate);
      if (a > b) {
        this.message.error('Date of Issue must be less than or equal to Due Date', 'Please select again');
        // return { issueDate: true };
      } else
        if (b > a) {
          return null;
        } else
          if (a === b) {
            return null;
          } else {
            return null;
          }
    }

  }
}
