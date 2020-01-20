import { Component, OnInit, Injector, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentView } from '@modules/_shared/models/invoice/payment-view.model';
import { Payment2Service } from '@modules/_shared/services/payment2.service';

@Component({
  selector: 'xb-list-payment2',
  templateUrl: './list-payment.component.html'
})
export class ListPayment2Component extends AppComponentBase implements OnInit {
  // tslint:disable-next-line:no-output-rename
  @Output('addNewPayment') addPaymentOutput = new EventEmitter();
  // tslint:disable-next-line:no-output-rename
  @Output('deletePayment') deletePaymentOutput = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('editPayment') editPaymentOutput = new EventEmitter<any>();
  @Input() invoiceNumber: string;
  @Input() invoiceId: number;
  @Input() outstandingAmount: number;
  @Input() data: any;
  @Input() paymentViews: PaymentView[] = [];

  loadingIndicator = false;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  isCheck: number;

  constructor(
    injector: Injector,
    private paymentService: Payment2Service,
    private modalService: NgbModal) {
    super(injector);
  }

  ngOnInit() {
    this.isCheck = 0;
  }
  addNewPayment() {
    this.addPaymentOutput.emit();
  }
  deletePayment() {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    this.deletePaymentOutput.emit(this.selected);
    this.selected = [];
  }
  delete(row) {
    this.selected.push(row);
    this.deletePaymentOutput.emit(this.selected);
    this.selected = [];
  }
  editPayment() {
      if (this.selected.length === 0) {
        this.message.warning('Please select a item from the list?');
        return;
      }
      if (this.selected.length > 1) {
        this.message.warning('Only one payment selected to edit?');
        return;
      }
      this.editPaymentOutput.emit(this.selected);
      this.selected = [];
  }
  getRowHeight(row) {
    return row.height;
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (this.selected.length === 0) {
    }
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
      if (event.type === 'click' && event.value !== '') {
        event.cellElement.blur();
        this.editPaymentOutput.emit(event.row);
      }
  }
  xxx(e: any) {
    this.editPaymentOutput.emit(e);
    return this.isCheck = 1;
  }
}
