import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentView } from '../models/invoice/payment-view.model';

@Injectable()
export class PaymentService extends BaseService {

  url = API_URI.payment;
  getAll(invoiceId: number): Observable<PaymentView[]> {
    return this.get<PaymentView[]>(
      `${this.url}?invoiceId=${invoiceId}`
    );
  }
  getPaymentIvByid(id: any): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.paymentIvById}/${id}`, id);
  }

  getPayment(id: number): Observable<PaymentView> {
    return this.get<PaymentView>(`${this.url}/${id}`);
  }
  createPayment(payment: PaymentView): Observable<PaymentView> {
    return this.post<PaymentView>(`${this.url}`, payment);
  }
  updatePayment(payment: PaymentView) {
    return this.put<PaymentView>(`${this.url}/${payment.id}`, payment);
  }
  deletePayment(id: number) {
    return this.delete(`${this.url}/${id}`);
  }
}
