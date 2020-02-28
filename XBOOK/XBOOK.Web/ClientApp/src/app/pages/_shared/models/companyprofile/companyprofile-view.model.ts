import { BaseModel } from '../../../../shared/model/base.model';

export class CompanyprofileView extends BaseModel {
  companyName: string;
  address: string;
  city: number;
  country: number;
  zipCode: string;
  currency: string;
  dateFormat: string;
  bizPhone: number;
  bankAccount: string;
  mobilePhone: string;
  directorName: string;
  logoFilePath: string;
  taxCode: number;
  code: string;
}
export class CompanyprofileViewModel {
  clientID: number;
  clientName: string;
  address: string;
  note: string;
  outstanding: number;
  overdue: number;
  bankAccount: string;
}
