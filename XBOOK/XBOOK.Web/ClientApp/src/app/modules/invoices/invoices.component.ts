import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xb-invoices',
  templateUrl: './invoices.component.html'
})

export class InvoicesComponent implements OnInit {

  constructor(private router: Router) {
  }
  ngOnInit() {
  }
  redirectToCreateNewInvoice() {
    this.router.navigate([`/invoice/new`]);
  }
}
