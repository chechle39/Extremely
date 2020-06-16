import { Observable } from 'rxjs';
import { TaxInvoiceView } from '../models/tax-invoice/tax-invoice-view.model';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { TaxBuyInvoiceView } from '../models/tax-buy-invoice/tax-buy-invoice-view.model.model';

@Injectable()
export class TaxBuyInvoiceService extends BaseService {
  url = API_URI.getAllTaxBuyInvoice;
  fileName: any;

  // Updated Api
  getAll(request: any): Observable<TaxBuyInvoiceView> {
    return this.post<TaxBuyInvoiceView>(`${this.url}`, request);
  }
  getInvoice(id: any): Observable<TaxBuyInvoiceView> {
    return this.post<TaxBuyInvoiceView>(`${API_URI.taxBuyInvoiceById}/${id}`, id);
  }
  updateSaleInv(request: any) {
    return this.put<any>(`${API_URI.updateTaxBuyInv}`, request);
  }
  getInfofile(request): Observable<any> {
    return this.post<any>(`${API_URI.getTaxBuyInvoiceFileName}`, request);
  }
  CreateSaleInv(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createTaxBuySaleInv}`, request);
  }
  uploadFile(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.uploadProfile}`, files);
  }
  getFile(fileName: any): Observable<any> {
    return this.getFilex<any>(`${API_URI.getFile}`, fileName);
  }
  getLastInvoice(): Observable<any> {
    return this.post<TaxBuyInvoiceView>(`${API_URI.lastTaxBuyInvoice}`, null);
  }
  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getProfile}`, null);
  }
  uploadFileInvMt(files: any): Observable<any> {
    return this.postUploadMuntiple<any>(`${API_URI.uploadFileTaxBuyInv}`, files);
  }
  removeFile(request): Observable<any> {
    return this.post<any>(`${API_URI.removeFileTaxBuyInv}`, request);
  }
  getDF(): Observable<TaxInvoiceView> {
    return this.post<TaxInvoiceView>(`${API_URI.taxBuyInvoiceDF}`, null);
  }
  deleteInvoice(id: any) {
    return this.post(`${API_URI.deleteTaxBuyInvoice}`, id);
  }
  getTaxInvDetailByInvoiceId(request): Observable<any> {
    return this.post<any>(`${API_URI.getBuyInvDetailByInvoiceId}`, request);
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
