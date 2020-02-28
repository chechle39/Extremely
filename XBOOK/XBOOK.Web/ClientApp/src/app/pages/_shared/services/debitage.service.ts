import { Injectable } from '@angular/core';
import { DebitAgeView } from '../models/debit-age/debitage-view.model';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class DebitAgeService extends BaseService {


  GetALLDebitAge(request): Observable<DebitAgeView> {
    return this.post<DebitAgeView>(
      `${API_URI.getDebitAge}`, request
    );
  }
  DebitAgeSaveDataPrint(requeData: any) {
    return this.post(`${API_URI.DebitAgeSaveDataPrint}`, requeData);
  }

}
