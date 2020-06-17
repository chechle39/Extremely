import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { GetUnMapToInvoiceReceiptViewModel } from '../models/getunmaptoinvoice/getunmaptoinvoice.model';

@Injectable()
export class GetUnMapToInvoiceService extends BaseService {
    search(term: any) {
        const clients = this.post<GetUnMapToInvoiceReceiptViewModel[]>(`${API_URI.GetUn_mapToInvoice}`, term)
          .pipe(
            //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return (
                  data.length !== 0 ? data as GetUnMapToInvoiceReceiptViewModel[]
                  : new Array<GetUnMapToInvoiceReceiptViewModel>()
                );
              },
            ));

        return clients;
      }
      checkExist(term: any) {
        const clients = this.post<boolean>(`${API_URI.checkExist}`, term)
          .pipe(
            //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return data;
              },
            ));

        return clients;
      }
}
