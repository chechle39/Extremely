import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'InvoiceNumberPipe',
})
export class InvoiceNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!value) {
      return '';
    }

    return value.split(',').length > 1 ?
     value.split(',')[0] + '...' :
      value.split(',')[0];
  }

}
