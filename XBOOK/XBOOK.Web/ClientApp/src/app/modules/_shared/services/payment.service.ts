import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentView } from '../models/invoice/payment-view.model';

@Injectable()
export class PaymentService extends BaseService {

  getPaymentIvByid(id: any): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.paymentIvById}/${id}`, id);
  }

  getPayment(id: any): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.paymentById}/${id}`, id);
  }
  createPayment(payment: PaymentView): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.paymentCreate}`, payment);
  }
  updatePayment(payment: PaymentView) {
    return this.put<PaymentView>(`${API_URI.updatePayment}`, payment);
  }
  deletePayment(id: number) {
    return this.post(`${API_URI.deletePayment}/${id}`, id );
  }
}
