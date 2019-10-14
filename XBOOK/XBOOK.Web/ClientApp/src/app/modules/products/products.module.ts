import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '@modules/_shared/services/product.service';
import { FormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [ProductsComponent, CreateProductComponent, EditProductComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule
  ],
  providers: [ProductService],
  entryComponents: [EditProductComponent, CreateProductComponent]
})
export class ProductsModule { }

