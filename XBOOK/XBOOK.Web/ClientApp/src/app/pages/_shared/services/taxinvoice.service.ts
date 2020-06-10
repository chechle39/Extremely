import { Observable } from 'rxjs';
import { TaxInvoiceView } from '../models/tax-invoice/tax-invoice-view.model';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { switchMap, debounceTime } from 'rxjs/operators';

@Injectable()
export class TaxInvoiceService extends BaseService {
  url = API_URI.getAllTaxInvoice;
  fileName: any;

  // Updated Api
  getAll(request: any): Observable<TaxInvoiceView> {
    return this.post<TaxInvoiceView>(`${this.url}`, request);
  }
  getInvoice(id: any): Observable<TaxInvoiceView> {
    return this.post<TaxInvoiceView>(`${API_URI.taxInvoiceById}/${id}`, id);
  }
  updateSaleInv(request: any) {
    return this.put<any>(`${API_URI.updateTaxSaleInv}`, request);
  }
  getInfofile(request): Observable<any> {
    return this.post<any>(`${API_URI.getTaxInvoiceFileName}`, request);
  }
  CreateSaleInv(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createTaxSaleInv}`, request);
  }
  uploadFile(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.uploadProfile}`, files);
  }
  getFile(fileName: any): Observable<any> {
    return this.getFilex<any>(`${API_URI.getFile}`, fileName);
  }
  getLastInvoice(): Observable<any> {
    return this.post<TaxInvoiceView>(`${API_URI.lastTaxInvoice}`, null);
  }
  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getProfile}`, null);
  }
  uploadFileInvMt(files: any): Observable<any> {
    return this.postUploadMuntiple<any>(`${API_URI.uploadFileTaxInv}`, files);
  }
  removeFile(request): Observable<any> {
    return this.post<any>(`${API_URI.removeFileTaxInv}`, request);
  }


  // Not update yet
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

  getDF(): Observable<TaxInvoiceView> {
    return this.post<TaxInvoiceView>(`${API_URI.invoiceDF}`, null);
  }
  deleteInvoice(id: any) {
    return this.post(`${API_URI.deleteTaxSaleInvoice}`, id);
  }
  CreateSaleInvDetail(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createSaleInvDetail}`, request);
  }


  deleteInvoiceDetail(id) {
    return this.post(`${API_URI.deleteSaleInvoiceDetail}`, id);
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
