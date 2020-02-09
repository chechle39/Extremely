import { BaseService } from '@shared/service/base.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URI } from 'environments/app.config';
import { AcountChartViewModel } from '../models/accountchart/account-chart.model';
import { Observable } from 'rxjs';

@Injectable()
export class AccountChartService extends BaseService {

  updateAccountChart(request: any) {
    return this.put<any>(`${API_URI.updateAcountChart}`, request);
  }
  searchAcc() {
    const gen = this.post<any[]>(`${API_URI.getAccountChart}`, null)
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

  searchAccTree() {
    const gen = this.post<any[]>(`${API_URI.getAccountChartTree}`, null)
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

  createAccountChart(acc: any): Observable<AcountChartViewModel> {
    return this.post<AcountChartViewModel>(`${API_URI.createAccountChart}`, acc);
  }

  deleteAccount(rs: any) {
    return this.post(`${API_URI.deleteAccount}`, rs);
  }
}
