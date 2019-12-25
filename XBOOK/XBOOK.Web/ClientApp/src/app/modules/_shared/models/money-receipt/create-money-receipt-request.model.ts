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
}
