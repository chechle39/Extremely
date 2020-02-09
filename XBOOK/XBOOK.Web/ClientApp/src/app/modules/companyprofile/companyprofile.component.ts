import { Component, OnInit, Injector } from '@angular/core';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCompanyprofileComponent } from './create-companyprofile/create-companyprofile.component';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
// import { EditClientComponent } from './edit-client/edit-client.component';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataService } from '@modules/_shared/services/data.service';
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
    private data: DataService,
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
        console.log(this.companyprofileViews.companyName);
        this.name = this.companyprofileViews.companyName;
        const data = [{
          companyName : this.companyprofileViews.companyName,
        }];
        this.companyprofileViews1.push(data);
        console.log(this.companyprofileViews1);
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
   //   createOrEditClientDialog = this.modalService.open(EditClientComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = id;
    }
    createOrEditClientDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
}
