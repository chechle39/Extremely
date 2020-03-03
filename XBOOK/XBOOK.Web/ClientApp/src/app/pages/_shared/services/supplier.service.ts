import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { SupplierSearchModel } from '../models/supplier/supplier-search.model';
import { SupplierView } from '../models/supplier/supplier-view.model';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class SupplierService extends BaseService {
  getSupplier(id: any): Observable<SupplierView> {
    return this.post<SupplierView>(
      `${API_URI.supplierById}/${id}`, id,
    );
  }
  GetFieldNameSupplier(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.GetFieldName}`, files);
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
      `${API_URI.getSupplierDap}`, request,
    );
  }
  createImportSupplier(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createImportSupplier}`, request);
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
          },
        ));

    return supplier;
  }
  ExportSupplier(request: any) {
    const data = this.postcsv<any[]>(`${API_URI.ExportSupplier}`, request).subscribe(rs => {
      this.downLoadFile(rs, 'text/csv');
    });
    return data;
  }
  downLoadFile(data: any, type: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    saveAs(blob, 'Supplier.csv');
  }
}
