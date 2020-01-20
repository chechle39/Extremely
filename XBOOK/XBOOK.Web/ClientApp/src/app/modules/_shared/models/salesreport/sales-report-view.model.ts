import { SalesReportData } from './sales-info-view.model';
import { PaymentView } from '@modules/_shared/models/invoice/payment-view.model';
import { ClientView } from '../client/client-view.model';

export class SalesReportListData {
  productName: string;
  totalAmount: number;
  totalDiscount: number;
  totalPayment: number;
  SalesReportData: SalesReportData[];
}
