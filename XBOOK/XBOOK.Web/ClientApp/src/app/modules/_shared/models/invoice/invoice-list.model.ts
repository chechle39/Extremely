import { PagingModel } from '@shared/model/paging.model';
import { InvoiceView } from './invoice-view.model';

export class InvoiceList extends PagingModel<InvoiceView> {
  constructor() {
    super();
    this.searchCondition = '';
  }
  searchCondition: string;
}
