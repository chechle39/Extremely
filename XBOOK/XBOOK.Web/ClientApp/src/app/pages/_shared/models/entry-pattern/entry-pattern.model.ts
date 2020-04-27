export class EntryBatternViewModel {
    patternID: number;
    transactionType: string;
    entryType: string;
    accNumber: string;
    crspAccNumber: string;
    note: string;
}

export class EntryPatternRequest {
    transactionType: string;
    entryType: string;
}

export class TransactionTypeRequest {
    transactionType: string;
}