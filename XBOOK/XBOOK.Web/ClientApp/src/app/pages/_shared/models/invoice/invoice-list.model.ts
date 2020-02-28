import { InvoiceView } from './invoice-view.model';
import { PagingModel } from '../../../../shared/model/paging.model';

export class InvoiceList extends PagingModel<InvoiceView> {
  constructor() {
    super();
    this.searchCondition = '';
  }
  searchCondition: string;
}
