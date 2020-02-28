import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCompanyprofileComponent } from './create-companyprofile/create-companyprofile.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { EditCompanyprofileComponent } from './edit-companyprofile/edit-companyprofile.component';
import { PagedRequestDto, PagedListingComponentBase } from '../../coreapp/paged-listing-component-base';

import * as _ from 'lodash';
import { CompanyService } from '../_shared/services/company-profile.service';
import { AppConsts } from '../../coreapp/app.consts';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss'],

})
export class CompanyProfileComponent extends PagedListingComponentBase<any> {
  companyprofileViews: any;
  companyprofileViews1: any[] = [];
  companyCity: any[] = [];
  loadingIndicator = true;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  name: any;
  id: any;
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
        // if ( this.companyprofileViews.length === 0) {
        //   console.log(this.companyprofileViews.length);
        //   this.id = this.companyprofileViews[0].id;
        // }
        const data = [{
          companyName: this.companyprofileViews.companyName,
        }];
        this.companyprofileViews1.push(data);
        if (this.companyprofileViews.length === 0) {
          const createClientDialog = this.modalService.open(CreateCompanyprofileComponent,
            AppConsts.modalOptionsCustomSize);
        } else {
          const createOrEditClientDialog = this.modalService.open(EditCompanyprofileComponent,
            AppConsts.modalOptionsCustomSize);
          createOrEditClientDialog.componentInstance.id = this.companyprofileViews[0].id;
          createOrEditClientDialog.result.then(result => {
            if (result) {
              this.refresh();
            }
          });
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



}
