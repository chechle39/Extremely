import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MoneyReceiptViewModel } from '../models/money-receipt/money-receipt.model';
import {
    CreateMoneyReceiptRequest,
    CreateMoneyReceiptRequestList } from '../models/money-receipt/create-money-receipt-request.model';
import { GetMoneyReceipyRequest } from '../models/money-receipt/get-money-receipy-request.model';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class MoneyReceiptService extends BaseService {
    getLastMoney(): Observable<MoneyReceiptViewModel> {
        return this.post<MoneyReceiptViewModel>(`${API_URI.getLastMoneyReceipt}`, null);
    }

    createMoneyReceipt(request: CreateMoneyReceiptRequest): Observable<any> {
        return this.post<any>(`${API_URI.createMoneyReceipt}`, request);
    }

    updateMoneyReceipt(request: CreateMoneyReceiptRequest): Observable<any> {
        return this.post<any>(`${API_URI.updateMoneyReceipt}`, request);
    }
    getMoneyReceiptById(id): Observable<any> {
        return this.post<any>(`${API_URI.getAllMoneyReceiptByIDURL}/${id}`, null);
    }
    getAllMoneyReceipt(request: GetMoneyReceipyRequest): Observable<MoneyReceiptViewModel[]> {
        return this.post<any>(`${API_URI.getAllMoneyReceiptURL}`, request);
    }

    deleteMoneyReceipt(request): Observable<any> {
        return this.post<any>(`${API_URI.deleteMoneyReceiptURL}`, request);
    }

    createMoneyReceiptPayMent(request: CreateMoneyReceiptRequestList): Observable<any> {
        return this.post<any>(`${API_URI.createMoneyReceiptPay}`, request);
    }
    MoneyReceiptSaveDataPrint(requeData: any): Observable<any> {
        return this.post<any>(`${API_URI.MoneyReceiptSaveDataPrint}`, requeData);
    }

}
