import { BaseModel } from '@shared/model/base.model';
export class AccountBalanceView extends BaseModel {
  accNumber: string;
  accName: string;
  debitOpening: number;
  creditOpening: number;
  debit: number;
  credit: number;
  debitClosing: number;
  creditClosing: number;
}
export class AccountBalanceViewModel {
  accNumber: string;
  accName: string;
  debitOpening: number;
  creditOpening: number;
  debit: number;
  credit: number;
  debitClosing: number;
  creditClosing: number;
}
