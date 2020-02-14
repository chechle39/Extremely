import { Component, OnInit, Injector } from '@angular/core';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCompanyprofileComponent } from './create-companyprofile/create-companyprofile.component';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import { EditCompanyprofileComponent } from './edit-companyprofile/edit-companyprofile.component';

import * as _ from 'lodash';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss']

})
export class CompanyProfileComponent extends PagedListingComponentBase<ClientView> {
  companyprofileViews: any;
  companyprofileViews1: any[] = [];
  loadingIndicator = true;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  name: any;
  messageTest: string;
  constructor(
    injector: Injector,
    private companyProfileService: CompanyService,
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
    this.companyProfileService
      .getInfoProfile()
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.companyprofileViews = i;
        this.name = this.companyprofileViews.companyName;
        const data = [{
          companyName: this.companyprofileViews.companyName,
        }];
        this.companyprofileViews1.push(data);
      });
  }
  createClient(): void {
    this.showCreateOrEditClientDialog();
  }
  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    if (id === undefined || id <= 0) {
      createOrEditClientDialog = this.modalService.open(CreateCompanyprofileComponent, AppConsts.modalOptionsCustomSize);
    } else {
      createOrEditClientDialog = this.modalService.open(EditCompanyprofileComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = id;
    }
    createOrEditClientDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
  getRowHeight(row) {
    return row.height;
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
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

  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click' && event.cellIndex > 0) {
      event.cellElement.blur();
      const createOrEditClientDialog = this.modalService.open(EditCompanyprofileComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = event.row.id;
      createOrEditClientDialog.result.then(result => {
        if (result) {
          this.refresh();
        }
      });
    }
  }

}
