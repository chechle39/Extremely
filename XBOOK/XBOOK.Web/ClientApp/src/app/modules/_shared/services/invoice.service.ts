import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { InvoiceList } from '../models/invoice/invoice-list.model';
import { Observable } from 'rxjs';
import { InvoiceView } from '../models/invoice/invoice-view.model';
import { Injectable } from '@angular/core';
import { SaleInvoiceCreateRequest } from '../models/invoice/sale-invoice-create-request';

@Injectable()
export class InvoiceService extends BaseService {
  url = API_URI.invoice;
  getAll(request: any): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${this.url}`, request);
  }
  getInvoice(id: any): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${API_URI.invoiceById}/${id}`, id);
  }
  deleteInvoice(id: number) {
    return this.delete(`${this.url}/${id}`);
  }
  CreateSaleInv(request: any): Observable<any> {
     return this.post<any>(`${API_URI.createSaleInv}`, request);
  }
  CreateSaleInvDetail(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createSaleInvDetail}`, request);
 }
}
