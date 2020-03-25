import { Component, OnInit, Injector } from '@angular/core';
import { CompanyService } from '../_shared/services/company-profile.service';
import { Router } from '@angular/router';
import { ClientView } from '../_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { finalize, debounceTime } from 'rxjs/operators';
import { CreateMasterParamComponent } from './create-masterparam/create-masterparam.component';
import * as _ from 'lodash';
import { CommonService } from '../../shared/service/common.service';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-masterparam',
  templateUrl: './masterparam.component.html',
  styleUrls: ['./masterparam.component.scss'],

})
export class MasterParamComponent extends PagedListingComponentBase<ClientView> {
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
    private commonService: CommonService,
    private router: Router) {
    super(injector);
    this.commonService.CheckAssessFunc('Master Param');
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
    this.companyProfileService
      .getInfoProfile()
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        }),
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
    this.createClient();
  }
  createClient(): void {
    this.showCreateOrEditClientDialog();
    this.router.navigateByUrl('/pages/masterParam', {skipLocationChange: true}).then(() =>
    this.router.navigate(['/pages']));
  }
  showCreateOrEditClientDialog(id?: number): void {
    let createOrEditClientDialog;
    if (id === undefined || id <= 0) {
      this.modalService.dismissAll();
      createOrEditClientDialog = this.modalService.open(CreateMasterParamComponent, AppConsts.modalOptionsCustomSize);
    } else {
   //  createOrEditClientDialog = this.modalService.open(EditCompanyprofileComponent, AppConsts.modalOptionsCustomSize);
      createOrEditClientDialog.componentInstance.id = id;
    }
    createOrEditClientDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });
  }
}
