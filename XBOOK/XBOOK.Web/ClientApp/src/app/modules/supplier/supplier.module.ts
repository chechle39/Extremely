import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { SupplierComponent } from './supplier.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierService } from '@modules/_shared/services/supplier.service';
@NgModule({
  declarations: [SupplierComponent, CreateSupplierComponent, EditSupplierComponent],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule
  ],
  providers: [SupplierService, CurrencyPipe, DecimalPipe],
  entryComponents: [EditSupplierComponent, CreateSupplierComponent]
})
export class SupplierModule { }
