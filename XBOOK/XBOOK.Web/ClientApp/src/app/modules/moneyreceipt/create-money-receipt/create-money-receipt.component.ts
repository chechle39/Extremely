import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@core/app-base.component';
import { PaymentMethod } from '@modules/_shared/models/invoice/payment-method.model';
import { Observable, Subject, merge, of } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ClientService } from '@modules/_shared/services/client.service';
import { ClientSearchModel } from '@modules/_shared/models/client/client-search.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyReceiptService } from '@modules/_shared/services/money-receipt.service';
import { MoneyReceiptViewModel } from '@modules/_shared/models/money-receipt/money-receipt.model';
import { EntryBatternService } from '@modules/_shared/services/entry-pattern.service';
import { EntryBatternViewModel } from '@modules/_shared/models/Entry-Pattern/entry-pattern.model';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import {
  CreateMoneyReceiptRequest,
  CreateMoneyReceiptRequestList
} from '@modules/_shared/models/money-receipt/create-money-receipt-request.model';
import * as _ from 'lodash';
@Component({
  selector: 'xb-create-money-receipt',
  templateUrl: './create-money-receipt.component.html',
  styleUrls: ['./create-money-receipt.component.scss']
})
export class CreateMoneyReceiptComponent extends AppComponentBase implements OnInit {
  @Input() title = 'Add a payment';
  @Input() outstandingAmount: any;
  @Input() invoice: any;
  @Input() clientId: any;
  @Input() clientName: any;
  @Input() contactName: any;
  @Input() bankAccount: any;
  @Input() row: any;
  @ViewChild('xxx', {
    static: true
  }) xxx: ElementRef;
  paymentMethods = [
    new PaymentMethod(1, 'Cash'),
    new PaymentMethod(2, 'Visa card'),
    new PaymentMethod(3, 'Bank transfer')
  ];
  companyName: any;
  companyAddress: any;
  companyCode: any;
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new ClientSearchModel();
  LastMoneyReceipt: MoneyReceiptViewModel;
  receiptNumber: string;
  entryBatternList: EntryBatternViewModel[];
  money: number;
  inVoiceList: any = [];
  public moneyReceipt: FormGroup;

  constructor(
    injector: Injector,
    private router: Router,
    public activeModal: NgbActiveModal,
    private clientService: ClientService,
    private invoiceService: InvoiceService,
    private moneyReceiptService: MoneyReceiptService,
    private entryBatternService: EntryBatternService,
    public fb: FormBuilder) {
    super(injector);
    this.moneyReceipt = this.createMoneyReceiptFormGroup();
  }

  ngOnInit() {
    if (this.outstandingAmount !== undefined) {
      this.moneyReceipt.controls.amount.patchValue(this.outstandingAmount);
      this.moneyReceipt.controls.clienId.patchValue(this.clientId);
      this.moneyReceipt.controls.clientName.patchValue(this.clientName);
      this.moneyReceipt.controls.receiverName.patchValue(this.contactName);
      this.moneyReceipt.controls.bankAccount.patchValue(this.bankAccount);
      const data = {
        clientName: this.clientName,
        contactName: this.moneyReceipt.value.receiverName,
        clientId: this.clientId,
        bankAccount: this.bankAccount
      } as ClientSearchModel;
      this.clientSelected = data;
    }
    if (this.row !== undefined) {
      const today = new Date(this.row.payDate).toLocaleDateString('en-GB');
      const payDateSplit = today.split('/');
      const payDatePicker = { year: Number(payDateSplit[2]), month: Number(payDateSplit[1]), day: Number(payDateSplit[0]) };
      this.moneyReceipt.controls.id.patchValue(this.row.id);
      this.moneyReceipt.controls.amount.patchValue(this.row.amount);
      this.moneyReceipt.controls.receiptNumber.patchValue(this.row.receiptNumber);
      this.moneyReceipt.controls.receiverName.patchValue(this.row.receiverName);
      this.moneyReceipt.controls.clientName.patchValue(this.row.clientName);
      this.moneyReceipt.controls.entryType.patchValue(this.row.entryType);
      this.moneyReceipt.controls.paymentMethods.patchValue(this.paymentMethods.filter(x => x.payType === this.row.payType)[0].payTypeId);
      this.moneyReceipt.controls.payDate.patchValue(payDatePicker);
      this.moneyReceipt.controls.bankAccount.patchValue(this.row.bankAccount);
      this.moneyReceipt.controls.note.patchValue(this.row.note);
      this.moneyReceipt.controls.clienId.patchValue(this.row.clientID);

      const data = {
        clientName: this.moneyReceipt.value.clientName,
        contactName: this.moneyReceipt.value.receiverName,
        clientId: this.moneyReceipt.value.clienId,
        bankAccount: this.moneyReceipt.value.bankAccount,
      } as ClientSearchModel;
      this.clientSelected = data;
    }
    if (this.row === undefined) {
      this.getLastDataMoneyReceipt();
    }
    this.getAllEntryData();
    this.getProfiles();
  }
  getProfiles() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.companyAddress = rp.address;
      this.companyCode = rp.code;
    });
  }
  getParam(data) {
    this.inVoiceList = [];
    const sortData = data.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    const dataList = [];
    this.money = parseFloat(this.moneyReceipt.controls.amount.value.toString().split(',').join(''));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < sortData.length; i++) {
      let y = 0;
      if (this.money >= sortData[i].amountIv) {
        y = this.money - sortData[i].amountIv;
      } else {
        y = this.money;
      }


      // if (this.money < 0){
      //   if(Math.abs(this.money) < sortData[i].amountIv) {
      //     this.money = Math.abs(this.money)
      //   } else if (Math.abs(this.money) === sortData[i].amountIv) {
      //     this.money = 0;
      //   }
      // }
      let sum = 0;
      if (dataList.length > 0) {
        sum = _.sumBy(dataList, item => {
          return item.amountIv;
        });
      }
      let xx = 0;
      if (i <= 0 && sortData[i].amountIv < this.money) {
        xx = sortData[i].amountIv;
      } else if (i <= 0 && sortData[i].amountIv > this.money) {
        xx = this.money;
      } else if (i > 0 && sortData[i].amountIv < this.money - sum) {
        xx = sortData[i].amountIv;
      } else if (i > 0 && sortData[i].amountIv >= this.money - sum) {
        xx = this.money - sum;
      } else {
        xx = this.money;
      }
      const x = {
        invoiceId: sortData[i].invoiceId,
        amountIv: xx,
        dueDate: sortData[i].dueDate
      };
      dataList.push(x);
      this.inVoiceList.push(x);
    }
  }

  // getDate(dateParam) {
  //   const date = new Date();
  //   const xx = new Date(date.toLocaleDateString());
  //   const pr = new Date(dateParam);
  //   const diffTime = Math.ceil(pr.getTime() - xx.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return parseFloat(diffDays.toString());
  // }

  getLastDataMoneyReceipt() {
    this.moneyReceiptService.getLastMoney().subscribe(rp => {
      this.LastMoneyReceipt = rp;
      // this.receiptNumber = rp.receiptNumber;
      this.moneyReceipt.controls.receiptNumber.patchValue(rp.receiptNumber);
    });
  }

  getAllEntryData() {
    this.entryBatternService.getAllEntry().subscribe((rp: EntryBatternViewModel[]) => {
      this.entryBatternList = rp;
      if (this.row === undefined) {
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList[0].entryType);
      } else {
        const entry = this.entryBatternList.filter(x => x.entryType === this.row.entryType);
        this.moneyReceipt.controls.entryType.patchValue(entry[0].entryType);
      }
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
    this.moneyReceipt.controls.clienId.patchValue(this.clientSelected.clientId);
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
      amount: [0, [Validators.required]],
      receiptNumber: ['', [Validators.required]],
      clientName: [''],
      receiverName: ['', [Validators.required]],
      entryType: [null, Validators.required],
      paymentMethods: [this.paymentMethods[0].payTypeId, [Validators.required]],
      payDate: payDatePicker,
      bankAccount: [''],
      note: [''],
      clienId: ['']
    });
  }

  saveMoneyReceipt(submittedForm: FormGroup) {
    if (!this.moneyReceipt.valid) {
      return;
    }
    const payDate = submittedForm.controls.payDate.value;
    const payDateData = [payDate.year, payDate.month, payDate.day].join('-');
    if (this.outstandingAmount !== undefined) {
      this.getParam(this.invoice);
      const requestList = {
        InvoiceId: this.inVoiceList,
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
        ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName
      } as CreateMoneyReceiptRequestList;
      this.moneyReceiptService.createMoneyReceiptPayMent(requestList).subscribe(rp => {
        this.notify.info('Saved Successfully');
        this.close(false);
      });
    } else if (this.moneyReceipt.value.id === 0) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName:  this.moneyReceipt.value.clientName.clientName !== undefined
        ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
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
    } else if (this.moneyReceipt.value.id > 0) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
          ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id
      } as CreateMoneyReceiptRequest;
      this.moneyReceiptService.updateMoneyReceipt(request).subscribe(rp => {
        this.notify.info('update Successfully');
        this.close(false);
      });
    }
  }


  // Print
  Print() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      const payDate = this.moneyReceipt.value.payDate;
      const payDateData = [payDate.year, payDate.month, payDate.day].join('-');
      const request = {
        amount: this.moneyReceipt.value.amount,
        yourCompanyAddress: rp.address,
        yourCompanyName: rp.companyName,
        payDate: payDateData,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
          ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id
      };
      const reportName = 'MoneyReceiptReport';
      this.moneyReceiptService.MoneyReceiptSaveDataPrint(request).subscribe(re => {
        this.router.navigate([`/print/${reportName}`]);
        this.close(false);
      });
    });
  }
}
