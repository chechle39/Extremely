export class SaleInvoiceCreateRequest {
    invoiceId: number;
    invoiceSerial: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    reference: string;
    subTotal: number;
    discRate: number;
    discount: number;
    vatTax: number;
    amountPaid: number;
    note: string;
    term: string;
    status: string;
    clientId: number;
    clientName: string;
    address: string;
    taxCode: string;
    tag: string;
    contactName: string;
    email: string;
}
