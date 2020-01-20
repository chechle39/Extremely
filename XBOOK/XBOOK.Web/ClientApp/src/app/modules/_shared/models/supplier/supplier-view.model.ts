import { BaseModel } from '@shared/model/base.model';
export class SupplierView extends BaseModel {
    supplierName: string;
    address: string;
    taxCode: number;
    tag: number;
    contactName: string;
    email: string;
    note: string;
    supplierID: number;
    bankAccount: string;
}
export class SupplierViewModel {
    supplierID: number;
    supplierName: string;
    address: string;
    note: string;
    outstanding: number;
    overdue: number;
    bankAccount: string;
}
