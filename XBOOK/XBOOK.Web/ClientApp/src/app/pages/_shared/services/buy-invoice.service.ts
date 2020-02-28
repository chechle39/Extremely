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
    deleteBuyInvoiceDetail(id: number) {
        return this.post(`${API_URI.deleteBuyInvoiceDetail}/${id}`, id);
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
    getAll(request: any): Observable<BuyInvoiceView> {
        return this.post<BuyInvoiceView>(`${API_URI.buyinvoice}`, request);
    }
    deleteBuyInvoice(id: any) {
        return this.post(`${API_URI.deleteBuyInvoice}`, id);
    }
}
