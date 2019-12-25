import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { Observable } from 'rxjs';
import { MoneyReceiptViewModel } from '../models/money-receipt/money-receipt.model';
import { API_URI } from 'environments/app.config';
import { CreateMoneyReceiptRequest } from '../models/money-receipt/create-money-receipt-request.model';
import { GetMoneyReceipyRequest } from '../models/money-receipt/get-money-receipy-request.model';

@Injectable()
export class MoneyReceiptService extends BaseService {
    getLastMoney(): Observable<MoneyReceiptViewModel> {
        return this.post<MoneyReceiptViewModel>(`${API_URI.getLastMoneyReceipt}`, null);
    }

    createMoneyReceipt(request: CreateMoneyReceiptRequest): Observable<any> {
        return this.post<any>(`${API_URI.createMoneyReceipt}`, request);
    }

    getAllMoneyReceipt(request: GetMoneyReceipyRequest): Observable<MoneyReceiptViewModel[]> {
        return this.post<any>(`${API_URI.getAllMoneyReceiptURL}`, request);
    }

    deleteMoneyReceipt(request): Observable<any> {
        return this.post<any>(`${API_URI.deleteMoneyReceiptURL}`, request);
    }
}
