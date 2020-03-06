import { Component, OnInit, Injector } from '@angular/core';
import { ClientService } from '../_shared/services/client.service';
import { Router } from '@angular/router';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientComponent } from './create-client/create-client.component';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { EditClientComponent } from './edit-client/edit-client.component';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataService } from '../_shared/services/data.service';
import { ImportClientComponent } from './import-client/import-client.component';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],

})
export class ClientsComponent extends PagedListingComponentBase<ClientView> {
  clientViews: any;
  loadingIndicator = true;
  keyword = '';
  reorderable = true;
  selected = [];
  FieldName: any[] = [];
  Datareport: any[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  messageTest: string;
  fileUpload: any[] = [];
  nameFile: string;
  img: string | ArrayBuffer;
  constructor(
    private data: DataService,
    injector: Injector,
    private clientService: ClientService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {

    request.clientKeyword = this.keyword;
    this.loadingIndicator = true;
    const clientKey = {
      clientKeyword: this.clientKeyword.toLocaleLowerCase(),
      isGrid: true,
    };
    this.clientService
      .getClientData(clientKey)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
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
    this.showCreateOrEditClientDialog(this.selected[0].clientID);
    this.selected = [];
  }
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const deleteList = [];
    this.message.confirm('Do you want to delete clients ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        const id = element.clientID;
        deleteList.push({ id });
      });
      this.clientService.deleteClient(deleteList).subscribe(() => {
        this.notify.success('Successfully Deleted');
        this.refresh();
      });
      this.selected = [];
    });
  }
  ExportClient() {
    this.clientService.ExportClient(this.clientViews);
  }
  public showPreview(files): void {
    if (files.length === 0) {
    return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.img = reader.result;
    };
    // tslint:disable-next-line:variable-name
    this.clientService.GetFieldName(files).subscribe((rp: any) => {
      this.Datareport = rp;
      const createOrEditClientDialog = this.modalService.open(ImportClientComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = this.Datareport;
    }, (er) => {
        this.message.warning('Vui lòng chọn file có định dạng .csv');
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
    if (event.type === 'click' && event.cellIndex > 0) {
      event.cellElement.blur();
      const createOrEditClientDialog = this.modalService.open(EditClientComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = event.row.clientID;
      createOrEditClientDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
    }
  }

  public getOutstanding(): number {
    return _.sumBy(this.clientViews, (item: any) => {
      return item.outstanding;
    });
  }

  public getOverduce(): number {
    return _.sumBy(this.clientViews, (item: any) => {
      return item.overdue;
    });
  }

  ShowInv() {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    let clientName = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selected.length; i++) {
      clientName += ';' + this.selected[i].clientName;
    }
    this.data.sendMessage(clientName);
    this.router.navigate([`/pages/invoice`]);
  }
}
