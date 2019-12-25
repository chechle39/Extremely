import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@core/app-base.component';
import { PaymentMethod } from '@modules/_shared/models/invoice/payment-method.model';
import { Observable, Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ClientService } from '@modules/_shared/services/client.service';
import { ClientSearchModel } from '@modules/_shared/models/client/client-search.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyReceiptService } from '@modules/_shared/services/money-receipt.service';
import { MoneyReceiptViewModel } from '@modules/_shared/models/money-receipt/money-receipt.model';
import { EntryBatternService } from '@modules/_shared/services/entry-pattern.service';
import { EntryBatternViewModel } from '@modules/_shared/models/Entry-Pattern/entry-pattern.model';
import { CreateMoneyReceiptRequest } from '@modules/_shared/models/money-receipt/create-money-receipt-request.model';

@Component({
  selector: 'xb-create-money-receipt',
  templateUrl: './create-money-receipt.component.html',
  styleUrls: ['./create-money-receipt.component.scss']
})
export class CreateMoneyReceiptComponent extends AppComponentBase implements OnInit {
  @ViewChild('xxx', {
    static: true
  }) xxx: ElementRef;
  paymentMethods = [
    new PaymentMethod(1, 'Cash'),
    new PaymentMethod(2, 'Visa card'),
    new PaymentMethod(3, 'Bank transfer')
  ];
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new ClientSearchModel();
  clientName: string;
  LastMoneyReceipt: MoneyReceiptViewModel;
  receiptNumber: string;
  entryBatternList: EntryBatternViewModel[];
  public moneyReceipt: FormGroup;

  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private clientService: ClientService,
    private moneyReceiptService: MoneyReceiptService,
    private entryBatternService: EntryBatternService,
    public fb: FormBuilder) {
    super(injector);
    this.moneyReceipt = this.createMoneyReceiptFormGroup();
  }

  ngOnInit() {
    this.getLastDataMoneyReceipt();
    this.getAllEntryData();
  }

  getLastDataMoneyReceipt() {
    this.moneyReceiptService.getLastMoney().subscribe(rp => {
      this.LastMoneyReceipt = rp;
      this.receiptNumber = rp.receiptNumber;
      this.moneyReceipt.controls.receiptNumber.patchValue(rp.receiptNumber);
    });
  }

  getAllEntryData() {
    this.entryBatternService.getAllEntry().subscribe((rp: EntryBatternViewModel[]) => {
      this.entryBatternList = rp;
      this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList[0].entryType);
    });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }

  searchClient = (text$: Observable<string>) => {
    this.isCheckFc = false;
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term =>
        this.clientService.searchClient(this.requestClient(term)).pipe(
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ));
  }

  requestClient(e: any) {
    const clientKey = {
      clientKeyword: e.toLocaleLowerCase(),
    };
    return clientKey;
  }

  selectedItem(item) {
    this.clientSelected = item.item as ClientSearchModel;
    this.moneyReceipt.controls.clientName.patchValue(this.clientSelected.clientName);
    this.moneyReceipt.controls.receiverName.patchValue(this.clientSelected.contactName);
  }

  clientFormatter(value: any) {
    if (value.contactName) {
      return value.contactName;
    }
    return value;
  }

  createMoneyReceiptFormGroup() {
    const today = new Date().toLocaleDateString('en-GB');
    const payDateSplit = today.split('/');
    const payDatePicker = { year: Number(payDateSplit[2]), month: Number(payDateSplit[1]), day: Number(payDateSplit[0]) };
    return this.fb.group({
      id: [0],
      amount: ['', [Validators.required]],
      receiptNumber: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      receiverName: ['', [Validators.required]],
      entryType: [null, Validators.required],
      paymentMethods: [this.paymentMethods[0].payTypeId, [Validators.required]],
      payDate: payDatePicker,
      bankAccount: [''],
      note: ['']
    });
  }

  saveMoneyReceipt(submittedForm: FormGroup) {
    if (!this.moneyReceipt.valid) {
      return;
    }
    const xx = this.moneyReceipt.value as CreateMoneyReceiptRequest;
    const payDate = submittedForm.controls.payDate.value;
    const payDateData = [payDate.year, payDate.month, payDate.day].join('-');
    const request = {
      amount: this.moneyReceipt.value.amount,
      bankAccount: this.moneyReceipt.value.bankAccount,
      clientID: this.moneyReceipt.value.clientName.clientId,
      clientName: this.moneyReceipt.value.clientName.clientName,
      entryType: this.moneyReceipt.value.entryType,
      note: this.moneyReceipt.value.note,
      payDate: payDateData,
      payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
      payTypeID: this.moneyReceipt.value.paymentMethods,
      receiptNumber: this.moneyReceipt.value.receiptNumber,
      receiverName: this.moneyReceipt.value.receiverName
    } as CreateMoneyReceiptRequest;

    this.moneyReceiptService.createMoneyReceipt(request).subscribe(rp => {
      this.notify.info('Saved Successfully');
      this.close(false);
    });
  }
}
