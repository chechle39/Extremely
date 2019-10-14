import { Component, OnInit, Injector } from '@angular/core';
import { ClientService } from '@modules/_shared/services/client.service';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientComponent } from './create-client/create-client.component';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { EditClientComponent } from './edit-client/edit-client.component';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
class PagedClientsRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'xb-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent extends PagedListingComponentBase<ClientView> {
  clientViews: ClientView[] = [];
  loadingIndicator = false;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  constructor(
    injector: Injector,
    private clientService: ClientService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {

    request.keyword = this.keyword;
    this.loadingIndicator = true;
    this.clientService
      .getAll(request.keyword)
      .pipe(
        debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.clientViews = i;
      });
  }

  edit(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }
    if (this.selected.length > 1) {
      this.message.warning('Only one item selected to edit?');
      return;
    }
    this.showCreateOrEditClientDialog(this.selected[0].id);
    this.selected = [];
  }
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    this.message.confirm('Do you want to delete clients ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        this.clientService.deleteClient(element.id).subscribe(() => {
          this.notify.success('Successfully Deleted');
          this.refresh();
        });
      });
      this.selected = [];
    });
  }
  getRowHeight(row) {
    return row.height;
  }
  createClient(): void {
    this.showCreateOrEditClientDialog();
  }
  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    if (id === undefined || id <= 0) {
      createOrEditClientDialog = this.modalService.open(CreateClientComponent, AppConsts.modalOptionsCustomSize);
    } else {
      createOrEditClientDialog = this.modalService.open(EditClientComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = id;
    }
    createOrEditClientDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click' && event.value !== '') {
      event.cellElement.blur();
      const createOrEditClientDialog = this.modalService.open(EditClientComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = event.row.id;
      createOrEditClientDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
    }
  }
  public getOutstanding(): number {
    return _.sumBy(this.clientViews, item => {
      return 12.5 * 1000000;
    });
  }
  public getOverduce(): number {
    return _.sumBy(this.clientViews, item => {
      return 125.4 * 1000000;
    });
  }
}
