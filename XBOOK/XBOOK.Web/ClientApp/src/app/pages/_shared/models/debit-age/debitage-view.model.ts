import { BaseModel } from '../../../../shared/model/base.model';

export class DebitAgeView extends BaseModel {
  clientName: string;
  day0To30: number;
  day31To60: number;
  day61To90: number;
  day90More: number;  
  subTotal: number;

}

