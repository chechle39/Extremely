export class CreateMoneyReceiptRequest {
    receiptNumber: string;
    entryType: string;
    clientID: number;
    clientName: string;
    receiverName: string;
    payDate: string;
    payTypeID: number;
    payType: string;
    bankAccount: string;
    amount: number;
    note: string;
    id: number;
}

export class CreateMoneyReceiptRequestList {
    receiptNumber: string;
    entryType: string;
    clientID: number;
    clientName: string;
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
