import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataService } from '../_shared/services/data.service';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { SupplierService } from '../_shared/services/supplier.service';
import { ImportSupplierComponent } from './import-supplier/import-supplier.component';
import { AuthenticationService } from '../../coreapp/services/authentication.service';
import { CommonService } from '../../shared/service/common.service';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],

})
export class SupplierComponent extends PagedListingComponentBase<ClientView> {
  clientViews: any;
  loadingIndicator = true;
  keyword = '';
  Datareport: any[] = [];
  SupplierViewsExport: any[] = [];
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
    public authenticationService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Supplier');
  }
  @ViewChild('paramTypeSelected', { static: true }) paramTypeSelected: ElementRef;
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
    this.supplierService
      .getSupplierData(clientKey)
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
  ExportSupplier() {
    if (this.clientViews.length > 0) {
      this.SupplierViewsExport = [];
      for (let i = 0; i < this.clientViews.length ; i++) {
        const data = {
          supplierID : this.clientViews[i].supplierID === null ? '' : this.clientViews[i].supplierID ,
          // tslint:disable-next-line:max-line-length
          supplierName : this.clientViews[i].supplierName === null ? '' :  this.clientViews[i].supplierName.replace(/,/g, ';'),
          address : this.clientViews[i].address === null ? '' :  this.clientViews[i].address.replace(/,/g, ';'),
          taxCode : this.clientViews[i].taxCode === null ? '' : this.clientViews[i].taxCode.replace(/,/g, ';'),
          Tag: this.clientViews[i].Tag === undefined ? '' : this.clientViews[i].Tag.replace(/,/g, ';'),
          // tslint:disable-next-line:max-line-length
          contactName : this.clientViews[i].contactName === null ? '' : this.clientViews[i].contactName.replace(/,/g, ';'),
          email : this.clientViews[i].email,
          note : this.clientViews[i].note === null ? '' : this.clientViews[i].note.replace(/,/g, ';'),
          bankAccount : this.clientViews[i].bankAccount,
        };
        this.SupplierViewsExport.push(data);
      }
      this.supplierService.ExportSupplier(this.SupplierViewsExport);
    }
  }
  public showPreview(files): void {
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    // tslint:disable-next-line:variable-name
    // tslint:disable-next-line:variable-name
    this.supplierService.GetFieldNameSupplier(files).subscribe((rp: any) => {
      this.Datareport = rp;
      this.paramTypeSelected.nativeElement.value = null;
      const createOrEditClientDialog = this.modalService.open(ImportSupplierComponent
        , AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = this.Datareport;
      createOrEditClientDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
    },  (er) => {
      this.message.warning('Vui lòng chọn file có định dạng .csv');
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
    this.router.navigate([`/pages/buyinvoice`]);
  }
}
