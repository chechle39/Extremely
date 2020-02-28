import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
@Injectable()
export class TaxService extends BaseService {

    getAll(): Observable<any> {
        return this.post<any>(`${API_URI.taxGetAll}`, null);
    }
    addTax(request: any): Observable<any> {
        return this.post<any>(`${API_URI.createTax}`, request);
    }
    deleteTax(request: any): Observable<any> {
        return this.post<any>(`${API_URI.deleteTax}`, request);
    }
}
