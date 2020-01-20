import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '@core/services/i18n.service';
import { PaymentReceiptComponent } from './paymentreceipt.component';


const routes: Routes = [
  { path: '', component: PaymentReceiptComponent, data: { title: extract('paymentreceipt') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PaymentReceiptRoutingModule { }
