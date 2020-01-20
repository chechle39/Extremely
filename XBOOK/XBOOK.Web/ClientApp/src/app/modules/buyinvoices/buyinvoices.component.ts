import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xb-buyinvoices',
  templateUrl: './buyInvoices.component.html'
})

export class BuyInvoicesComponent implements OnInit {

  constructor(private router: Router) {
  }
  ngOnInit() {
  }
  redirectToCreateNewInvoice() {
    this.router.navigate([`/invoice/new`]);
  }
}
