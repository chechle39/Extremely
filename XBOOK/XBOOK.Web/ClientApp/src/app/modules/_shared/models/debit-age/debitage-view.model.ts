import { BaseModel } from '@shared/model/base.model';
export class DebitAgeView extends BaseModel {
  companyName: string;
  firstMonth: number;
  secondMonth: number;
  thirdMonth: number;
  fourthMonth: number;
  sumtotal: number;

}

