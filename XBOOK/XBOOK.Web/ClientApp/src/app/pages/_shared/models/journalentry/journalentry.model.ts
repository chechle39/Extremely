export interface JournalEntryViewModel {
    id: number;
    entryName: string;
    description: string;
    dateCreate: string;
    objectType: string;
    objectID: number;
    objectName: string;
}

export class DataMap {
    id: number;
    objectName: string;
    objectType: string;
}
export class Data {
    id: number;
    objectName: string;
    objectType: string;
}

export interface CreateRequest {
    id: number;
    entryName: string;
    description: string;
    dateCreate: string;
    objectType: string;
    objectID: number;
    objectName: string;
    detail: Detail[];
}

export interface Detail {
    id: number;
    accNumber: string;
    crspAccNumber: string;
    note: string;
    debit: number;
    credit: number;
}
export class Datatable {
    accountNumber: string;
    accountName: string;
}
