import { ClientView } from '../client/client-view.model';
import { TaxInvoiceDetail } from '../tax-invoice/sale-invoice-detail.model';

export class TaxBuyInvoiceView {
    taxInvoiceID: number;
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
    amount: number;
    taxAmount: number;
    amountPaid: number;
    note: string;
    term: string;
    status: string;
    bankAccount: string;
    saleInvoiceId: number;
    taxInvDetailView: TaxInvoiceDetail[];
    clientData: ClientView[];
}
