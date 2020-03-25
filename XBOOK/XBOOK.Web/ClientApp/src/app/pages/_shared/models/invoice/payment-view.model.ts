import { BaseModel } from '../../../../shared/model/base.model';

export class PaymentView extends BaseModel {
  invoiceId: number;
  productId: number;
  payDate: string;
  payTypeId: number;
  payType: string;
  receiptNumber: string;
  amount: number;
  note: string;
  payName: string;
}
