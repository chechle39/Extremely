import { BaseModel } from '@shared/model/base.model';
export class ClientSearchModel extends BaseModel {
  clientId: number;
  clientName: string;
  address: string;
  taxCode: string;
  contactName: string;
  email: string;
}
