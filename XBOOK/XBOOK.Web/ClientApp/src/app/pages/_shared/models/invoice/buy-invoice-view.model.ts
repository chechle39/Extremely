import { SaleInvoiceDetail } from './sale-invoice-detail.model';
import { ClientView } from '../client/client-view.model';
import { PaymentView } from './payment-view.model';

export class BuyInvoiceView {
  invoiceId: number;
  invoiceSerial: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  supplierID: number;
  supplierName: string;
  address: string;
  taxCode: string;
  contactName: string;
  email: string;
  reference: string;
  subTotal: number;
  discRate: number;
  discount: number;
  vatTax: number;
  amountPaid: number;
  note: string;
  term: string;
  status: string;
  bankAccount: string;
  saleInvDetailView: SaleInvoiceDetail[];
  paymentView: PaymentView[];
  clientData: ClientView[];
}
