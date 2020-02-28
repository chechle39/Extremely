import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xb-journalentries',
  templateUrl: './journalentries.component.html'
})

export class JournalEntriesComponent implements OnInit {

  constructor(private router: Router) {
  }
  ngOnInit() {
  }
  redirectToCreateNewInvoice() {
    this.router.navigate([`/journalentries/new`]);
  }
}
