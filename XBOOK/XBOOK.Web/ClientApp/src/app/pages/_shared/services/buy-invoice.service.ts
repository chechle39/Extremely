import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BuyInvoiceView } from '../models/invoice/buy-invoice-view.model';
import { saveAs } from 'file-saver';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class BuyInvoiceService extends BaseService {
    fileName: any;
    downLoadFile(fileName): Observable<any> {
        this.fileName = fileName;
        const data = this.getFileBlob<any>(`${API_URI.downLoadFileBuy}`, fileName).subscribe(rp => {
          const blob = new Blob([rp], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          saveAs(blob, this.fileName.filename);
        });
        return;
      }

      ExportBuyInvoice() {
        const data = this.postcsv<any[]>(`${API_URI.ExportBuyInvoice}`, null).subscribe(rs => {
          this.downLoadFileInvoice(rs, 'text/csv;charset=utf-8');
        });
        return data;
      }
      downLoadFileInvoice(data: any, type: string) {
        // tslint:disable-next-line:object-literal-shorthand
        const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, 'BuyInvoice.csv');
      }
    getFile(fileName: any): Observable<any> {
        return this.getFilex<any>(`${API_URI.getFileSupplier}`, fileName);
      }
    uploadFile(files: any): Observable<any> {
        return this.postUploadFile<any>(`${API_URI.uploadProfileSupplier}`, files);
      }
    getInfofile(request): Observable<any> {
        return this.post<any>(`${API_URI.getFileBuyName}`, request);
    }

    removeFile(request): Observable<any> {
        return this.post<any>(`${API_URI.removeFileBuy}`, request);
    }
    uploadFileInvMt(files: any): Observable<any> {
        return this.postUploadMuntiple<any>(`${API_URI.uploadFileBuyInv}`, files);
    }
    deleteBuyInvoiceDetail(id) {
        return this.post(`${API_URI.deleteBuyInvoiceDetail}`, id);
    }
    updateBuyInv(request: any) {
        return this.put<any>(`${API_URI.updateBuyInv}`, request);
    }
    getBuyInvoiceBuyId(id: any): Observable<BuyInvoiceView> {
        return this.post<BuyInvoiceView>(`${API_URI.byInvoiceById}/${id}`, id);
    }
    CreateBuyInvDetail(request: any): Observable<any> {
        return this.post<any>(`${API_URI.createBuyInvDetail}`, request);
    }
    getDF(): Observable<BuyInvoiceView> {
        return this.post<BuyInvoiceView>(`${API_URI.buyInvoiceDF}`, null);
    }
    CreateBuyInv(request: any): Observable<any> {
        return this.post<any>(`${API_URI.createBuyInv}`, request);
    }
    getLastBuyInvoice(): Observable<any> {
        return this.post<BuyInvoiceView>(`${API_URI.lastBuyInvoice}`, null);
    }
    getAllBuyInvoiceList(request: any): Observable<BuyInvoiceView> {
        return this.post<BuyInvoiceView>(`${API_URI.buyinvoice}`, request);
    }
    deleteBuyInvoice(id: any) {
        return this.post(`${API_URI.deleteBuyInvoice}`, id);
    }
}
