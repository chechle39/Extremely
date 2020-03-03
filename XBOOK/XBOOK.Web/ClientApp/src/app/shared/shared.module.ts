import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarDirective } from './directives/sidebar.directive';
import { SidebarLinkDirective } from './directives/sidebarlink.directive';
import { SidebarToggleDirective } from './directives/sidebartoggle.directive';
import { SidebarListDirective } from './directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebaranchortoggle.directive';
import { ThousandSuffixesPipe } from './pipe/thousand-suffixes.pipe';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from './utils/dateformat';
import { FilterPipe } from './pipe/filter.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { SplitPipe } from './pipe/split.pipe';
import { CreateMoneyReceiptComponent } from '../pages/moneyreceipt/create-money-receipt/create-money-receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AvatarModule } from 'ngx-avatar';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CreatePaymentReceiptComponent } from '../pages/paymentreceipt/payment-receipt/payment-receipt.component';
import { validateDirective } from './validators/validate';
import { validateDateDirective } from './validators/validateDateDirective';
import { SearchgenledComponent } from '../pages/genledgroup/searchgenledgroup/searchgenled.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { validatePasswordDirective } from './validators/validatePasswordDirective';
import { validateLengthPasswordDirective } from './validators/validatelengthpasswordirective';
import { validateInputDirective } from './validators/validateInputDirective';
@NgModule({
  declarations: [
    validateDateDirective,
    validatePasswordDirective,
    validateLengthPasswordDirective,
    validateDirective,
    validateInputDirective,
    SidebarDirective,
    SidebarLinkDirective,
    SidebarListDirective,
    SidebarAnchorToggleDirective,
    SidebarToggleDirective,
    AutoFocusDirective,
    ThousandSuffixesPipe,
    SplitPipe,
    CreateMoneyReceiptComponent,
    CreatePaymentReceiptComponent,
    SearchgenledComponent,
    FilterPipe],
  imports: [
    MultiSelectModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    DropDownsModule,
    ReactiveFormsModule,
    InputsModule,
    AvatarModule,
    NgxCleaveDirectiveModule,
    DigitOnlyModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
  ],
  exports: [
    validateDateDirective,
    validatePasswordDirective,
    validateLengthPasswordDirective,
    validateDirective,
    validateInputDirective,
    ThousandSuffixesPipe,
    TranslateModule,
    SidebarDirective,
    SidebarLinkDirective,
    SidebarListDirective,
    SidebarAnchorToggleDirective,
    SplitPipe,
    CreateMoneyReceiptComponent,
    CreatePaymentReceiptComponent,
    SearchgenledComponent,
    SidebarToggleDirective,
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
  ],
})
export class SharedModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
