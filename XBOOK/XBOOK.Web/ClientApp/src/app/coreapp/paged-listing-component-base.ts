import { AppComponentBase } from './app-base.component';
import { OnInit, Injector } from '@angular/core';
import { LayoutService } from '../@core/utils';
export class PagedResultDto {
  items: any[];
  totalCount: number;
}

export class EntityDto {
  id: number;
}

export class PagedRequestDto {
  skipCount: number;
  maxResultCount: number;
}
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {
  public pageSize = 50;
  public pageNumber = 1;
  public totalPages = 1;
  public totalItems: number;
  public isTableLoading = false;
  private layoutService: LayoutService;
  constructor(injector: Injector) {
    super(injector);
    this.layoutService = injector.get(LayoutService);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    setTimeout(() => {    // <<<---    using ()=> syntax
      this.getDataPage(this.pageNumber);
    }, 1000);
  }

  public showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;

    this.totalItems = result.totalCount;
    this.pageNumber = pageNumber;
  }

  public getDataPage(page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;

    this.isTableLoading = true;
    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

  public recalculateOnResize(callback: () => void) {
    let requestAnimation;
    const duration = 0.5;
    let counter = 0;

    const animationCallback = () => {
      callback();
      counter++;
      if (counter < duration * 60) {
        window.requestAnimationFrame(animationCallback);
      }
    };
    this.layoutService.onChangeLayoutSize().subscribe(() => {
      if (requestAnimation) { cancelAnimationFrame(requestAnimation); }
      counter = 0;
      requestAnimation = window.requestAnimationFrame(animationCallback);
    });
  }

  protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void;
 // protected abstract delete(id: number): void;
}

