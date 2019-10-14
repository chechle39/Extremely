import { BaseModel } from '@shared/model/base.model';
export class PaymentView extends BaseModel {
  invoiceId: number;
  productId: number;
  payDate: string;
  payTypeId: number;
  payType: string;
  bankAccount: string;
  amount: number;
  note: string;
}
