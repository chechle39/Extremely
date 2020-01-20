import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentView } from '../models/invoice/payment-view.model';

@Injectable()
export class Payment2Service extends BaseService {

  getPaymentIvByid(id: any): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.payment2IvById}/${id}`, id);
  }

  getPayment(id: any): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.payment2ById}/${id}`, id);
  }
  createPayment(payment: PaymentView): Observable<PaymentView> {
    return this.post<PaymentView>(`${API_URI.payment2Create}`, payment);
  }
  updatePayment(payment: PaymentView) {
    return this.put<PaymentView>(`${API_URI.updatePayment2}`, payment);
  }
  deletePayment(id: number) {
    return this.post(`${API_URI.deletePayment2}/${id}`, id );
  }
}
