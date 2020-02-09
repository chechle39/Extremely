import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { CompanyProfileRoutingModule } from './companyprofile-routing.module';
import { CompanyProfileComponent } from './companyprofile.component';
import { CreateCompanyprofileComponent } from './create-companyprofile/create-companyprofile.component';
// import { EditClientComponent } from './edit-client/edit-client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { SharedModule } from '@shared/shared.module';
import { ClientService } from '@modules/_shared/services/client.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
@NgModule({
  declarations: [CompanyProfileComponent, CreateCompanyprofileComponent],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule
  ],
  providers: [ClientService, CompanyProfileComponent, InvoiceService, CurrencyPipe, DecimalPipe, CompanyService],
  entryComponents: [CreateCompanyprofileComponent]
})
export class CompanyProfileModule { }
