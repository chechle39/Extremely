import { ClientView } from '../client/client-view.model';
import { TaxInvoiceDetail } from '../tax-invoice/sale-invoice-detail.model';
import { SupplierView } from '../supplier/supplier-view.model';
import { TaxBuyInvoiceDetail } from './tax-buy-invoice-detail.model';

export class TaxBuyInvoiceView {
    invoiceID: number;
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
    amount: number;
    taxAmount: number;
    amountPaid: number;
    note: string;
    term: string;
    status: string;
    bankAccount: string;
    saleInvoiceId: number;
    taxBuyInvDetailView: TaxBuyInvoiceDetail[];
    supplierData: SupplierView[];
}
