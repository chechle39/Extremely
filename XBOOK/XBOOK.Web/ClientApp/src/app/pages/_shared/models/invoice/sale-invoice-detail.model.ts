import { BaseModel } from '../../../../shared/model/base.model';
export class SaleInvoiceDetail extends BaseModel {
  invoiceId: number;
  productId: number;
  productName: string;
  description: string;
  qty: number;
  price: number;
  amount: number;
  vat: number;
}
