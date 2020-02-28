import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class GenLedGroupService extends BaseService {
    searchGen(request: any) {
        const gen = this.post<any[]>(`${API_URI.getGengroup}`, request)
          .pipe(
          //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return (
                  data.length !== 0 ? data as any[] : new Array<any>()
                );
              }
            ));
        return gen;
    }
    exportCSV(request: any) {
     const data = this.postcsv<any[]>(`${API_URI.exportCSVgroup}`, request).subscribe(rs => {
         this.downLoadFile(rs, 'text/csv');
      });
     return data;
  }

  downLoadFile(data: any, type: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const blob = new Blob([data], { type: type});
    const url = window.URL.createObjectURL(blob);
    saveAs(blob, 'GeneralLedger.csv');
  }
  GenGroupSaveDataPrint(requeData: any) {
    return this.post(`${API_URI.GenLedGroupSaveDataPrint}`, requeData);
  }

}
