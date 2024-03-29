import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class AccountDetailService extends BaseService {
    searchGen(request: any) {
        const gen = this.post<any[]>(`${API_URI.getAccountDetail}`, request)
          .pipe(
          //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return (
                  data.length !== 0 ? data as any[] : new Array<any>()
                );
              },
            ));
        return gen;
    }
    getDataReport(request: any) {
      const gen = this.post<any[]>(`${API_URI.getDataReportAccountDetail}`, request)
        .pipe(
        //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
          map(
            (data: any) => {
              return (
                data.length !== 0 ? data as any[] : new Array<any>()
              );
            },
          ));
      return gen;
  }
    AccountDeatilreportSaveDataPrint(requeData: any) {
      return this.post(`${API_URI.accountdetailreportSaveDataPrint}`, requeData);
    }
}
