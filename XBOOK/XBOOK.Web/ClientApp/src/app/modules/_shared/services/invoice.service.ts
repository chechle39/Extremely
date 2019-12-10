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

  getDF(): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${API_URI.invoiceDF}`, null);
  }
  getInvoice(id: any): Observable<InvoiceView> {
    return this.post<InvoiceView>(`${API_URI.invoiceById}/${id}`, id);
  }
  deleteInvoice(id: any) {
    return this.post(`${API_URI.deleteSaleInvoice}`, id);
  }
  CreateSaleInv(request: any): Observable<any> {
     return this.post<any>(`${API_URI.createSaleInv}`, request);
  }
  CreateSaleInvDetail(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createSaleInvDetail}`, request);
  }

  updateSaleInv(request: any) {
    return this.put<any>(`${API_URI.updateSaleInv}`, request);
  }

  deleteInvoiceDetail(id: number) {
    return this.post(`${API_URI.deleteSaleInvoiceDetail}/${id}`, id);
  }

  getLastInvoice(): Observable<any> {
    return this.post<InvoiceView>(`${API_URI.lastInvoice}`, null);
  }

    
  uploadFile(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.uploadProfile}`, files)
  }

  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getProfile}`, null);
  }

  getFile(fileName: any): Observable<any> {
    return this.getFilex<any>(`${API_URI.getFile}`, fileName)
  }

  uploadFileInvMt(files: any): Observable<any> {
    return this.postUploadMuntiple<any>(`${API_URI.uploadFileInv}`, files)
  }

  getInfofile(request): Observable<any> {
    return this.post<any>(`${API_URI.getFileName}`, request);
  }

  removeFile(request): Observable<any> {
    return this.post<any>(`${API_URI.removeFile}`, request);
  }
}
