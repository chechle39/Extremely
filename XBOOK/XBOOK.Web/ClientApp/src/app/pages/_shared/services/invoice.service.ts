import { Observable } from 'rxjs';
import { InvoiceView } from '../models/invoice/invoice-view.model';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { switchMap, debounceTime } from 'rxjs/operators';

@Injectable()
export class InvoiceService extends BaseService {
  url = API_URI.invoice;
  fileName: any;
  ExportInvoice() {
    const data = this.postcsv<any[]>(`${API_URI.ExportInvoice}`, null).subscribe(rs => {
      this.downLoadFileInvoice(rs, 'text/csv;charset=utf-8');
    });
    return data;
  }
  downLoadFileInvoice(data: any, type: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    saveAs(blob, 'SaleInvoice.csv');
  }
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

  deleteInvoiceDetail(id) {
    return this.post(`${API_URI.deleteSaleInvoiceDetail}`, id);
  }

  getLastInvoice(): Observable<any> {
    return this.post<InvoiceView>(`${API_URI.lastInvoice}`, null);
  }


  uploadFile(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.uploadProfile}`, files);
  }

  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getProfile}`, null);
  }

  getFile(fileName: any): Observable<any> {
    return this.getFilex<any>(`${API_URI.getFile}`, fileName);
  }

  uploadFileInvMt(files: any): Observable<any> {
    return this.postUploadMuntiple<any>(`${API_URI.uploadFileInv}`, files);
  }

  getInfofile(request): Observable<any> {
    return this.post<any>(`${API_URI.getFileName}`, request);
  }

  removeFile(request): Observable<any> {
    return this.post<any>(`${API_URI.removeFile}`, request);
  }

  SaleInvoiceSaveDataPrint(requeData: any) {
    return this.post(`${API_URI.saleInVoiceSaveDataPrint}`, requeData);
  }

  downLoadFile(fileName): Observable<any> {
    this.fileName = fileName;
    const data = this.getFileBlob<any>(`${API_URI.downLoadFile}`, fileName).subscribe(rp => {
      const blob = new Blob([rp], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      saveAs(blob, this.fileName.filename);
    });
    return;
  }

  downLoad(data: any, type: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    saveAs(blob);
  }


}
