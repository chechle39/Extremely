import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AccountBalanceViewModel } from '../models/accountbalance/accountbalance-view.model';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class AccountBalanceService extends BaseService {


  getAccountBalanceViewModelData(request): Observable<AccountBalanceViewModel> {
    return this.post<AccountBalanceViewModel>(
      `${API_URI.getAccountBalanceViewModelDap}`, request
    );
  }
  getAccountBalanceAccountViewModelData(request): Observable<AccountBalanceViewModel> {
    return this.post<AccountBalanceViewModel>(
      `${API_URI.getAccountBalanceAccountViewModelDap}`, request
    );
  }
  AccountBalanceSaveDataPrint(requeData: any) {
    return this.post(`${API_URI.AccountBalanceSaveDataPrint}`, requeData);
  }

}
