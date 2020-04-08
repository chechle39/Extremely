import {Component, Injectable} from '@angular/core';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
// @Injectable()
// export class CustomAdapter  {

//   readonly DELIMITER = '-';

//   fromModel(value: string | null): NgbDateStruct | null {
//     if (value) {
//       const date = value.split(this.DELIMITER);
//       const x = {
//         day : parseInt(date[0], 10),
//         month : parseInt(date[1], 10),
//         year : parseInt(date[2], 10),
//       };
//       return x;
//     }
//     return null;
//   }

//   toModel(date: NgbDateStruct | null): string | null {
//     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
//   }
// }

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter  {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
        const date = value.split(this.DELIMITER);
        const x = {
            day : parseInt(date[0], 10),
            month : parseInt(date[1], 10),
            year : parseInt(date[2], 10),
          };
          return x;
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? (date.day.toString().length !== 1 ? date.day : '0' + date.day)
    + this.DELIMITER + ( date.month.toString().length !== 1 ? date.month : '0' + date.month)
    +  this.DELIMITER + date.year : '';
  }
}
