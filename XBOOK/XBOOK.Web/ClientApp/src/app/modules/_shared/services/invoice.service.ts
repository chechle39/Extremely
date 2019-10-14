import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { InvoiceList } from '../models/invoice/invoice-list.model';
import { Observable } from 'rxjs';
import { InvoiceView } from '../models/invoice/invoice-view.model';
import { Injectable } from '@angular/core';

@Injectable()
export class InvoiceService extends BaseService {
  url = API_URI.invoice;
  // getAll(term: string): Observable<InvoiceView[]> {
  //   return this.get<InvoiceView[]>(
  //     `${this.url}/?q=${term}`
  //   );
  // }
  getAll(request: any): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${this.url}`, request);
  }
  // getInvoice(id: number): Observable<InvoiceView> {
  //   return this.get<InvoiceView>(`${this.url}/${id}`);
  // }
  getInvoice(id: any): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${API_URI.invoiceById}/${id}`, id);
  }
  deleteInvoice(id: number) {
    return this.delete(`${this.url}/${id}`);
  }
}
