export class CreatePaymentReceiptRequest {
    receiptNumber: string;
    entryType: string;
    supplierID: number;
    supplierName: string;
    receiverName: string;
    payDate: string;
    payTypeID: number;
    payType: string;
    bankAccount: string;
    amount: number;
    note: string;
    id: number;
}

export class CreatePaymentReceiptRequestList {
    receiptNumber: string;
    entryType: string;
    supplierID: number;
    supplierName: string;
    receiverName: string;
    payDate: string;
    payTypeID: number;
    payType: string;
    bankAccount: string;
    amount: number;
    note: string;
    InvoiceId: Invoice[];
}

export class Invoice {
    invoiceId: number;
    dueDate: string;
    amountIv: number;
}
