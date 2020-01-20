import { API_URI } from 'environments/app.config';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { ClientSearchModel } from '../models/client/client-search.model';
import { DebitAgeView } from '../models/debit-age/debitage-view.model';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
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
