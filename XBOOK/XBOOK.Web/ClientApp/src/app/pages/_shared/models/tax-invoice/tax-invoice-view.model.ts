import { TaxInvoiceDetail } from './sale-invoice-detail.model';
import { PaymentView } from '../invoice/payment-view.model';
import { ClientView } from '../client/client-view.model';

export class TaxInvoiceView {
    taxInvoiceId: number;
    invoiceSerial: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    clientID: number;
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
    bankAccount: string;
    saleInvoiceId: number;
    saleInvDetailView: TaxInvoiceDetail[];
    clientData: ClientView[];
}
