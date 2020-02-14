import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductService } from '@modules/_shared/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserService } from '@modules/_shared/services/user.service';
@NgModule({
  declarations: [UserComponent, CreateUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DigitOnlyModule,
    NgxCleaveDirectiveModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [ProductService, UserService],
  entryComponents: [CreateUserComponent]
})
export class UserModule { }

