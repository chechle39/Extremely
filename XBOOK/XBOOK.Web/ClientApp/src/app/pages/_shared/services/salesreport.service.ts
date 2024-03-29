import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';

@Injectable()
export class SalesReportService extends BaseService {
    searchGen(request: any) {
        const gen = this.post<any[]>(`${API_URI.getSalesreport}`, request)
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
    getDataReport(request: any) {
      const gen = this.post<any[]>(`${API_URI.getDataReport}`, request)
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
    SalesreportSaveDataPrint(requeData: any) {
      return this.post(`${API_URI.SalesreportSaveDataPrint}`, requeData);
    }
}
