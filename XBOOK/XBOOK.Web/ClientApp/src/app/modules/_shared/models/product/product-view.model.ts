import { BaseModel } from '@shared/model/base.model';
export class ProductView extends BaseModel {
  productName: string;
  description: string;
  unitPrice: number;
  categoryId: number;
  categoryName: string;
  unit: string;
}
