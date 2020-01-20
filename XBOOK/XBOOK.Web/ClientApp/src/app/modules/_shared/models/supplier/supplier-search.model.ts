import { BaseModel } from '@shared/model/base.model';
export class SupplierSearchModel extends BaseModel {
  supplierID: number;
  supplierName: string;
  address: string;
  taxCode: string;
  contactName: string;
  email: string;
  bankAccount: string;
}
