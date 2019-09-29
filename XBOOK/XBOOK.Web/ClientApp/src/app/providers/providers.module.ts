import { NgModule } from '@angular/core';
import { FormBuilderService } from './form-builder.service';
import { SaleInvoiceService } from './saleinvoice.service';

@NgModule({
    imports: [
    ],
    providers: [
        FormBuilderService,
        SaleInvoiceService
    ],
})
export class ProvidersModule { }
