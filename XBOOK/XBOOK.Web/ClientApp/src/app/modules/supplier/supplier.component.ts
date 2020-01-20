import { Component, OnInit, Injector } from '@angular/core';
import { ClientService } from '@modules/_shared/services/client.service';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataService } from '@modules/_shared/services/data.service';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { SupplierService } from '@modules/_shared/services/supplier.service';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']

})
export class SupplierComponent extends PagedListingComponentBase<ClientView> {
  clientViews: any;
  loadingIndicator = true;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  messageTest: string;
  constructor(
    private data: DataService,
    injector: Injector,
    private supplierService: SupplierService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }
  protected list(
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {

    request.clientKeyword = this.keyword;
    this.loadingIndicator = true;
    const clientKey = {
      clientKeyword: this.clientKeyword.toLocaleLowerCase(),
      isGrid: true
    };
    this.supplierService
      .getSupplierData(clientKey)
      .pipe(
        // debounceTime(500),
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
    this.showCreateOrEditClientDialog(this.selected[0].supplierID);
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
        const id = element.supplierID;
        deleteList.push({ id });
      });
      this.supplierService.deleteSupplier(deleteList).subscribe(() => {
        this.notify.success('Successfully Deleted');
        this.refresh();
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
      createOrEditClientDialog = this.modalService.open(CreateSupplierComponent, AppConsts.modalOptionsCustomSize);
    } else {
      createOrEditClientDialog = this.modalService.open(EditSupplierComponent, AppConsts.modalOptionsCustomSize);
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
      const createOrEditClientDialog = this.modalService.open(EditSupplierComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = event.row.supplierID;
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
    let supplierName = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selected.length; i++) {
      supplierName += ';' + this.selected[i].supplierName;
    }
    this.data.sendMessage(supplierName);
    this.router.navigate([`/buyinvoice`]);
  }
}
