import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'Split'
})
export class SplitPipe implements PipeTransform {
  transform(value: string, numberWorld: number): string {
    const nameSplit = value.split(' ');
    let result = '';
    if (nameSplit.length === 1) {
      result = nameSplit[0];
    } else {
      const nameArr = nameSplit.slice(-numberWorld);
      for (let i = 0; i < numberWorld; i++) {
        result = result + nameArr[i] + ' ';
      }
    }
    return result;
  }

}
