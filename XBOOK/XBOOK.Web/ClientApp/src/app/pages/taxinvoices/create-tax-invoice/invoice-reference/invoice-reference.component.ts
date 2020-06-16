import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceReferenceService } from '../../../_shared/services/invoice-reference.service';
import { InvoiceReferenceView } from '../../../_shared/models/invoice-reference/invoice-reference-view';
import { InvoiceReferenceRequest } from '../../../_shared/models/invoice-reference/invoice-refernce-request';
import { SelectionType } from '@swimlane/ngx-datatable';
import * as moment from 'moment';

@Component({
  selector: 'xb-invoice-reference',
  templateUrl: './invoice-reference.component.html',
  styleUrls: ['./invoice-reference.component.scss'],
})
export class InvoiceReferenceComponent implements OnInit {
  invoiceReferenceList: InvoiceReferenceView[] = [];
  selected: InvoiceReferenceView[] = [];
  fromDate: Date = moment().subtract(30, 'days').toDate();
  toDate: Date = new Date();
  isFromDateChecked: boolean = false;
  isToDateChecked: boolean = false;

  selectionType = SelectionType;
  constructor(
    public activeModal: NgbActiveModal,
    public invoiceReferenceService: InvoiceReferenceService,
    ) { }

  ngOnInit() {
    this.getinvoiceReference();
  }


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onDone() {
    this.activeModal.close(this.selected);
  }

  onFromDateSelect(event) {
    this.fromDate =  new Date(event.year, event.month - 1, event.day);
    this.isFromDateChecked = true;
    if (this.isFromDateChecked && this.isToDateChecked) {
      this.getinvoiceReference();
    }
  }

  onToDateSelect(event) {
    this.toDate =  new Date(event.year, event.month - 1, event.day);
    this.isToDateChecked = true;
    if (this.isFromDateChecked && this.isToDateChecked) {
      this.getinvoiceReference();
    }
  }

  getinvoiceReference() {

    const request = new InvoiceReferenceRequest();
    request.isSale = true;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    this.invoiceReferenceService.getInvoiceRefernce(request).subscribe((result: InvoiceReferenceView[]) => {
      this.invoiceReferenceList = result;
    });
    this.isFromDateChecked = false;
    this.isToDateChecked = false;
  }
}
