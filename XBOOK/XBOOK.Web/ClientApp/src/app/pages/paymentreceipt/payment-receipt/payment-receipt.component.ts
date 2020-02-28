import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { PaymentMethod } from '../../_shared/models/invoice/payment-method.model';
import { Observable, Subject, merge, of } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntryBatternService } from '../../_shared/services/entry-pattern.service';
import { EntryBatternViewModel } from '../../_shared/models/Entry-Pattern/entry-pattern.model';
import { InvoiceService } from '../../_shared/services/invoice.service';
import * as _ from 'lodash';
import { PaymentReceiptService } from '../../_shared/services/payment-receipt.service';
import { PaymentReceiptViewModel } from '../../_shared/models/payment-receipt/payment-receipt.model';
import { CreatePaymentReceiptRequestList,
  CreatePaymentReceiptRequest } from '../../_shared/models/payment-receipt/create-payment-receipt-request.model';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierSearchModel } from '../../_shared/models/supplier/supplier-search.model';
@Component({
  selector: 'xb-create-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
})
export class CreatePaymentReceiptComponent extends AppComponentBase implements OnInit {
  @Input() title = 'Add a payment';
  @Input() outstandingAmount: any;
  @Input() invoice: any;
  @Input() supplierID: any;
  @Input() supplierName: any;
  @Input() contactName: any;
  @Input() bankAccount: any;
  @Input() row: any;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  paymentMethods = [
    new PaymentMethod(1, 'Cash'),
    new PaymentMethod(2, 'Visa card'),
    new PaymentMethod(3, 'Bank transfer'),
  ];
  requestSaveJson: any[] = [];
  companyName: any;
  companyAddress: any;
  companyCode: any;
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new SupplierSearchModel();
  LastMoneyReceipt: PaymentReceiptViewModel;
  receiptNumber: string;
  entryBatternList: EntryBatternViewModel[];
  money: number;
  inVoiceList: any = [];
  public moneyReceipt: FormGroup;

  constructor(
    injector: Injector,
    private router: Router,
    public activeModal: NgbActiveModal,
    private supplierService: SupplierService,
    private invoiceService: InvoiceService,
    private paymentReceiptService: PaymentReceiptService,
    private entryBatternService: EntryBatternService,
    public fb: FormBuilder) {
    super(injector);
    this.moneyReceipt = this.createMoneyReceiptFormGroup();
  }

  ngOnInit() {
    if (this.outstandingAmount !== undefined) {
      this.moneyReceipt.controls.amount.patchValue(this.outstandingAmount);
      this.moneyReceipt.controls.supplierID.patchValue(this.supplierID);
      this.moneyReceipt.controls.supplierName.patchValue(this.supplierName);
      this.moneyReceipt.controls.receiverName.patchValue(this.contactName);
      this.moneyReceipt.controls.bankAccount.patchValue(this.bankAccount);
      const data = {
        supplierName: this.supplierName,
        contactName: this.moneyReceipt.value.receiverName,
        supplierID: this.supplierID,
        bankAccount: this.bankAccount,
      } as SupplierSearchModel;
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
      this.moneyReceipt.controls.supplierName.patchValue(this.row.supplierName);
      this.moneyReceipt.controls.entryType.patchValue(this.row.entryType);
      this.moneyReceipt.controls.paymentMethods.patchValue(this.paymentMethods.filter(x => x.payType === this.row.payType)[0].payTypeId);
      this.moneyReceipt.controls.payDate.patchValue(payDatePicker);
      this.moneyReceipt.controls.bankAccount.patchValue(this.row.bankAccount);
      this.moneyReceipt.controls.note.patchValue(this.row.note);
      this.moneyReceipt.controls.supplierID.patchValue(this.row.supplierID);

      const data = {
        supplierName: this.moneyReceipt.value.supplierName,
        contactName: this.moneyReceipt.value.receiverName,
        supplierID: this.moneyReceipt.value.supplierID,
        bankAccount: this.moneyReceipt.value.bankAccount,
      } as SupplierSearchModel;
      this.clientSelected = data;
    }
    if (this.row === undefined) {
      this.getLastDataMoneyReceipt();
    }
    this.getAllEntryData();
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
        dueDate: sortData[i].dueDate,
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
    this.paymentReceiptService.getLastPayment().subscribe(rp => {
      this.LastMoneyReceipt = rp;
      // this.receiptNumber = rp.receiptNumber;
      this.moneyReceipt.controls.receiptNumber.patchValue(rp === null ? null : rp.receiptNumber);
    });
  }

  getAllEntryData() {
    this.entryBatternService.getAllEntryPayment().subscribe((rp: EntryBatternViewModel[]) => {
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
        this.supplierService.searchSupplier(this.requestClient(term)).pipe(
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })),
      ));
  }

  requestClient(e: any) {
    const clientKey = {
      clientKeyword: e.toLocaleLowerCase(),
    };
    return clientKey;
  }

  selectedItem(item) {
    this.clientSelected = item.item as SupplierSearchModel;
    this.moneyReceipt.controls.supplierName.patchValue(this.clientSelected.supplierName);
    this.moneyReceipt.controls.receiverName.patchValue(this.clientSelected.contactName);
    this.moneyReceipt.controls.supplierID.patchValue(this.clientSelected.supplierID);
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
      supplierName: [''],
      receiverName: ['', [Validators.required]],
      entryType: [null, Validators.required],
      paymentMethods: [this.paymentMethods[0].payTypeId, [Validators.required]],
      payDate: payDatePicker,
      bankAccount: [''],
      note: [''],
      supplierID: [''],
    });
  }
  Print(submittedForm: FormGroup) {
    if (!this.moneyReceipt.valid) {
      return;
    }
    const payDate = submittedForm.controls.payDate.value;
    const payDateData = [payDate.year, payDate.month, payDate.day].join('-');
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      if (this.moneyReceipt.value.id > 0) {
        const request = {
          yourCompanyAddress: rp.address,
          yourCompanyName: rp.companyName,
          amount: this.moneyReceipt.value.amount,
          bankAccount: this.moneyReceipt.value.bankAccount,
          supplierID: this.moneyReceipt.value.supplierID,
          supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
            ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
          entryType: this.moneyReceipt.value.entryType,
          note: this.moneyReceipt.value.note,
          payDate: payDateData,
          payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
          payTypeID: this.moneyReceipt.value.paymentMethods,
          receiptNumber: this.moneyReceipt.value.receiptNumber,
          receiverName: this.moneyReceipt.value.receiverName,
          id: this.moneyReceipt.value.id,
        };
        this.requestSaveJson.push(request);
        const reportName = 'PaymentReceiptReport';
        this.paymentReceiptService.paymentReceiptSaveDataPrint(this.requestSaveJson).subscribe(rp1 => {
          this.router.navigate([`/pages/print/${reportName}`]);
          this.close(false);
        });
      }

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
        supplierID: this.moneyReceipt.value.supplierID,
        supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
        ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreatePaymentReceiptRequestList;
      this.paymentReceiptService.createPaymentReceiptPayMent(requestList).subscribe(rp => {
        this.notify.info('Saved Successfully');
        this.close(false);
      });
    } else if (this.moneyReceipt.value.id === 0) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        supplierID: this.moneyReceipt.value.supplierID,
        supplierName:  this.moneyReceipt.value.supplierName.supplierName !== undefined
        ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreatePaymentReceiptRequest;
      this.paymentReceiptService.createPaymentReceipt(request).subscribe(rp => {
        this.notify.info('Saved Successfully');
        this.close(false);
      });
    } else if (this.moneyReceipt.value.id > 0) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        supplierID: this.moneyReceipt.value.supplierID,
        supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
          ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.paymentMethods.filter(x => x.payTypeId === this.moneyReceipt.value.paymentMethods)[0].payType,
        payTypeID: this.moneyReceipt.value.paymentMethods,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id,
      } as CreatePaymentReceiptRequest;
      this.paymentReceiptService.updatePaymentReceipt(request).subscribe(rp => {
        this.notify.info('update Successfully');
        this.close(false);
      });
    }
  }
}
