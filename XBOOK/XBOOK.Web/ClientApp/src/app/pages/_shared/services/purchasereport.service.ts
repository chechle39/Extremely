import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class PurchaseReportService extends BaseService {
  searchGen(request: any) {
        const gen = this.post<any[]>(`${API_URI.getPurchaseReport}`, request)
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
      const gen = this.post<any[]>(`${API_URI.getDataPurchaseReportReport}`, request)
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
  PurchReportSaveDataPrint(requeData: any) {
      return this.post(`${API_URI.PurchasereportSaveDataPrint}`, requeData);
    }
}
