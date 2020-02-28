import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { CompanyProfileRoutingModule } from './companyprofile-routing.module';
import { CompanyProfileComponent } from './companyprofile.component';
import { CreateCompanyprofileComponent } from './create-companyprofile/create-companyprofile.component';
import { EditCompanyprofileComponent } from './edit-companyprofile/edit-companyprofile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CompanyService } from '../_shared/services/company-profile.service';
@NgModule({
  declarations: [CompanyProfileComponent, CreateCompanyprofileComponent, EditCompanyprofileComponent],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
  ],
  providers: [CompanyProfileComponent, CurrencyPipe, DecimalPipe, CompanyService],
  entryComponents: [CreateCompanyprofileComponent, EditCompanyprofileComponent],
})
export class CompanyProfileModule { }
