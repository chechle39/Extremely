import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '../_shared/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '../../shared/shared.module';
import { NbButtonModule, NbCardModule,
  NbPopoverModule, NbSearchModule, NbIconModule, NbAlertModule } from '@nebular/theme';
import { ImportProductComponent } from './import-product/import-product.component';
@NgModule({
  declarations: [ProductsComponent, CreateProductComponent, EditProductComponent, ImportProductComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    ProductsRoutingModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [ProductService],
  entryComponents: [EditProductComponent, CreateProductComponent, ImportProductComponent],
})
export class ProductsModule { }

