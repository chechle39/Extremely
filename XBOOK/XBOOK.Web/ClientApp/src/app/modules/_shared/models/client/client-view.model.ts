import { BaseModel } from '@shared/model/base.model';
export class ClientView extends BaseModel {
  clientName: string;
  address: string;
  taxCode: number;
  tag: number;
  contactName: string;
  email: string;
  note: string;
  clientId: number;
}
