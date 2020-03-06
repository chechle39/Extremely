import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class MasterParamService extends BaseService {

    getAll(): Observable<any> {
        return this.post<any>(`${API_URI.MasterGetAll}`, null);
    }
    addTax(request: any): Observable<any> {
        return this.post<any>(`${API_URI.createMaster}`, request);
    }
    deleteMaster(request: any): Observable<any> {
        return this.post<any>(`${API_URI.deleteMaster}`, request);
    }
    getProfile(id: any): Observable<any> {
        return this.post<any>(
          `${API_URI.MasterGetbyId}/${id}`, id
        );
    }
    updateMaster(request: any) {
        return this.put<any>(`${API_URI.updateMaster}`, request);
    }
}