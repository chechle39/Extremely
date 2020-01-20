import { API_URI } from 'environments/app.config';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { Observable } from 'rxjs';
import { SupplierSearchModel } from '../models/supplier/supplier-search.model';
import { SupplierView } from '../models/supplier/supplier-view.model';
@Injectable()
export class SupplierService extends BaseService {
  getSupplier(id: any): Observable<SupplierView> {
    return this.post<SupplierView>(
      `${API_URI.supplierById}/${id}`, id
    );
  }
  createSupplier(client: SupplierView): Observable<SupplierView> {
    return this.post<SupplierView>(`${API_URI.createSupplier}`, client);
  }
  updateSupplier(client: SupplierView) {
    return this.put<SupplierView>(`${API_URI.updateSupplier}`, client);
  }
  deleteSupplier(id: any) {
    return this.post(`${API_URI.deleteSupplier}`, id);
  }

  getSupplierData(request): Observable<SupplierView> {
    return this.post<SupplierView>(
      `${API_URI.getSupplierDap}`, request
    );
  }

    searchSupplier(term: any) {
    const supplier = this.post<SupplierSearchModel[]>(`${API_URI.supplierAll}`, term)
      .pipe(
        //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as SupplierSearchModel[] : new Array<SupplierSearchModel>()
            );
          }
        ));

    return supplier;
  }
}
