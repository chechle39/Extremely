import { SaleInvoiceDetail } from './sale-invoice-detail.model';
import { PaymentView } from '@modules/_shared/models/invoice/payment-view.model';
import { ClientView } from '../client/client-view.model';

export class InvoiceView {
  invoiceId: number;
  invoiceSerial: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  clientId: number;
  clientName: string;
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
  saleInvDetailView: SaleInvoiceDetail[];
  paymentView: PaymentView[];
  clientData: ClientView[];
}
