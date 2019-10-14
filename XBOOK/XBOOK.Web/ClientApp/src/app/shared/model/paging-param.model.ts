export class PagingParamModel {

  constructor() {
    this.pageSize = 0;
    this.pageIndex = 0;
    this.sortBy = null;
    this.sortOrder = null;
    this.searchCondition = null;
  }

  public pageSize: number;
  public pageIndex: number;
  public sortBy: string;
  public sortOrder: string;
  public searchCondition: string;

  static build(params: any) {
    return Object.assign(
      {},
      new PagingParamModel(),
      params
    );
  }

  public buildQueryString() {
    const queryParams = [];
    if (this.pageSize) { queryParams.push(`pagesize=${this.pageSize}`); }
    if (this.pageIndex) { queryParams.push(`pageindex=${this.pageIndex}`); }
    if (this.sortBy) { queryParams.push(`sortby=${this.sortBy}`); }
    if (this.sortOrder) { queryParams.push(`sortorder=${this.sortOrder}`); }
    if (this.searchCondition) { queryParams.push(`searchcondition=${this.searchCondition}`); }
    return queryParams.join('&');
  }
}
