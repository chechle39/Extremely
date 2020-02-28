import { SalesReportData } from './sales-info-view.model';
import { ClientView } from '../client/client-view.model';

export class SalesReportListData {
  productName: string;
  totalAmount: number;
  totalDiscount: number;
  totalPayment: number;
  SalesReportData: SalesReportData[];
}
