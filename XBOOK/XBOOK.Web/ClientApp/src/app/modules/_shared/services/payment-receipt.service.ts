import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { Observable } from 'rxjs';
import { MoneyReceiptViewModel } from '../models/money-receipt/money-receipt.model';
import { API_URI } from 'environments/app.config';
import { PaymentReceiptViewModel } from '../models/payment-receipt/payment-receipt.model';
import { CreatePaymentReceiptRequest,
    CreatePaymentReceiptRequestList } from '../models/payment-receipt/create-payment-receipt-request.model';
import { GetPaymentReceipyRequest } from '../models/payment-receipt/get-payment-receipy-request.model';

@Injectable()
export class PaymentReceiptService extends BaseService {
    getLastPayment(): Observable<PaymentReceiptViewModel> {
        return this.post<PaymentReceiptViewModel>(`${API_URI.getLastPaymentReceipt}`, null);
    }

    createPaymentReceipt(request: CreatePaymentReceiptRequest): Observable<any> {
        return this.post<any>(`${API_URI.createPaymentReceipt}`, request);
    }

    updatePaymentReceipt(request: CreatePaymentReceiptRequest): Observable<any> {
        return this.post<any>(`${API_URI.updatePaymentReceipt}`, request);
    }

    getAllPaymentReceiptData(request: GetPaymentReceipyRequest): Observable<PaymentReceiptViewModel[]> {
        return this.post<any>(`${API_URI.getAllPaymentReceiptURL}`, request);
    }

    deletePaymentReceipt(request): Observable<any> {
        return this.post<any>(`${API_URI.deletePaymentReceiptURL}`, request);
    }

    createPaymentReceiptPayMent(request: CreatePaymentReceiptRequestList): Observable<any> {
        return this.post<any>(`${API_URI.createPaymentReceiptPay}`, request);
    }


}
