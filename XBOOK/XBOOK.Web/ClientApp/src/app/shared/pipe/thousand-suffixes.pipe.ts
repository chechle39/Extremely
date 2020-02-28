import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'ThousandSuffixesPipe'
})
export class ThousandSuffixesPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    const suffixes = ['k', 'm', 'g', 't', 'p', 'e'];
    if (Number.isNaN(input)) {
      return null;
    }
    if (input < 1000) {
      return input;
    }
    const exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }
}
