import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { GenLedService } from '@modules/_shared/services/genled.service';
import { SearchgenledComponent } from './searchgenled/searchgenled.component';
import { saveAs } from 'file-saver';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-genled',
  templateUrl: './genled.component.html',
  styleUrls: ['./genled.component.scss']
})
export class GenledComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  case: any;
  genViews: any;
  startDay: any;
  endDay: any;
  keyspace: any;
  loadingIndicator = false;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  protected delete(id: number): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    injector: Injector,
    private genLedService: GenLedService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }

  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    const genledSearch = {
      startDate: null,
      endDate: null,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null
    };

    this.genLedService
      .searchGen(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.genViews = i;
      });
  }
  public getGrantTotal(): number {
    return _.sumBy(this.genViews, (item: any) => {
      return item.credit;
    });
  }
  public getGrantTotalDebit(): number {
    return _.sumBy(this.genViews, (item: any) => {
      return item.debit;
    });
  }

  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchgenledComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {

        this.exportCSV = result;
        this.genLedService.searchGen(result).subscribe(rp => {
          this.genViews = rp;
          this.case = result.case;
          console.log( this.case);
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - ';
        });

      }
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  exportData() {
    const genledSearch = {
      startDate: null,
      endDate: null,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null
    };
    this.genLedService.exportCSV(this.exportCSV === undefined ? genledSearch : this.exportCSV);

  }
}
