import { PAGING_CONFIG } from 'environments/app.config';

export class PagingModel<Type> {
  constructor() {
    this.data = [];
    this.count = 0;
    this.pageIndex = PAGING_CONFIG.pageIndex;
    this.pageSize = PAGING_CONFIG.pageSize;
  }
  data: Type[];
  count: number;
  pageSize: number;
  pageIndex: number;
  sortBy: string;
  sortOrder: string;
  searchCondition: string;
}
