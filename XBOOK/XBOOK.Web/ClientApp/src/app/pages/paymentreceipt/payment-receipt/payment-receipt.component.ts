import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { Observable, Subject, merge, of, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../_shared/services/invoice.service';
import * as _ from 'lodash';
import { PaymentReceiptService } from '../../_shared/services/payment-receipt.service';
import { PaymentReceiptViewModel } from '../../_shared/models/payment-receipt/payment-receipt.model';
import {
  CreatePaymentReceiptRequestList,
  CreatePaymentReceiptRequest,
} from '../../_shared/models/payment-receipt/create-payment-receipt-request.model';
import { SupplierService } from '../../_shared/services/supplier.service';
import { SupplierSearchModel } from '../../_shared/models/supplier/supplier-search.model';
import { MasterParamService } from '../../_shared/services/masterparam.service';
import { MasterParamModel } from '../../_shared/models/masterparam.model';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
@Component({
  selector: 'xb-create-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
})
export class CreatePaymentReceiptComponent extends AppComponentBase implements OnInit {
  @Input() entryBatternList: MasterParamModel[];
  @Input() LastMoneyReceipt: PaymentReceiptViewModel;
  @Input() moneyById: any;
  @Input() payment: MasterParamModel[];
  @Input() title: string;
  @Input() note: string;
  @Input() outstandingAmount: any;
  @Input() invoice: any;
  @Input() supplierID: any;
  @Input() supplierName: any;
  @Input() contactName: any;
  @Input() bankAccount: any;
  @Input() row: any;
  @Input() coppyMode: boolean = false;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  requestSaveJson: any[] = [];
  companyName: any;
  companyAddress: any;
  companyCode: any;
  address: any;
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new SupplierSearchModel();
  receiptNumber: string;
  money: number;
  inVoiceList: any = [];
  public moneyReceipt: FormGroup;
  isSave: boolean;

  constructor(
    injector: Injector,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private supplierService: SupplierService,
    private invoiceService: InvoiceService,
    private paymentReceiptService: PaymentReceiptService,
    public authenticationService: AuthenticationService,
    private masterParamService: MasterParamService,
    public fb: FormBuilder) {
    super(injector);
    this.moneyReceipt = this.createMoneyReceiptFormGroup();
  }

  ngOnInit() {
    this.getDataPayAndEntry();
    if (this.outstandingAmount !== undefined) {
      this.moneyReceipt.controls.amount.patchValue(this.outstandingAmount);
      this.moneyReceipt.controls.supplierID.patchValue(this.supplierID);
      this.moneyReceipt.controls.supplierName.patchValue(this.supplierName);
      this.moneyReceipt.controls.receiverName.patchValue(this.contactName);
      this.moneyReceipt.controls.bankAccount.patchValue(this.bankAccount);
      this.moneyReceipt.controls.note.patchValue(this.note);
      const data = {
        supplierName: this.supplierName,
        contactName: this.moneyReceipt.value.receiverName,
        supplierID: this.supplierID,
        bankAccount: this.bankAccount,
      } as SupplierSearchModel;
      this.clientSelected = data;
    }
    if (this.row !== undefined) {
      const today = new Date(this.moneyById.payDate).toLocaleDateString('en-GB');
        const payDateSplit = today.split('/');
        const payDatePicker = {
          year: Number(payDateSplit[2]),
          month: Number(payDateSplit[1]), day: Number(payDateSplit[0]),
        };
        this.address = this.moneyById.address,
          this.moneyReceipt.controls.id.patchValue(this.moneyById.id);
        this.moneyReceipt.controls.amount.patchValue(this.moneyById.amount);
        this.moneyReceipt.controls.receiptNumber.patchValue(!this.coppyMode ? this.moneyById.receiptNumber
          : this.LastMoneyReceipt.receiptNumber);
        this.moneyReceipt.controls.receiverName.patchValue(this.moneyById.receiverName);
        this.moneyReceipt.controls.supplierName.patchValue(this.moneyById.supplierName);
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList.filter(x => x.key ===
          this.row.entryType)[0].key);
        this.moneyReceipt.controls.paymentMethods.patchValue(this.moneyById.payType);
        this.moneyReceipt.controls.payDate.patchValue(payDatePicker);
        this.moneyReceipt.controls.bankAccount.patchValue(this.moneyById.bankAccount);
        this.moneyReceipt.controls.note.patchValue(this.moneyById.note);
        this.moneyReceipt.controls.supplierID.patchValue(this.moneyById.supplierID);
        const data = {
          supplierName: this.moneyReceipt.value.supplierName,
          contactName: this.moneyReceipt.value.receiverName,
          supplierID: this.moneyReceipt.value.supplierID,
          bankAccount: this.moneyReceipt.value.bankAccount,
        } as SupplierSearchModel;
        this.clientSelected = data;

    }
  }

  getParam(data) {
    this.inVoiceList = [];
    const sortData = data.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    const dataList = [];
    this.money = parseFloat(this.moneyReceipt.controls.amount.value.toString().split(',').join(''));
    for (let i = 0; i < sortData.length; i++) {
      let y = 0;
      if (this.money >= sortData[i].amountIv) {
        y = this.money - sortData[i].amountIv;
      } else {
        y = this.money;
      }
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

  getDataPayAndEntry() {
    if (this.row === undefined) {
      // this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList[0].key);
      if (this.outstandingAmount !== undefined) {
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList.filter(x => x.name
          === 'Chi tiền mua hàng')[0].key);
      } else {
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList[0].key);

      }
      this.moneyReceipt.controls.paymentMethods.patchValue(this.payment[0].key);
    } else {
      const entry = this.entryBatternList.filter(x => x.name === this.row.entryType);
    }
    this.moneyReceipt.controls.receiptNumber.patchValue(this.LastMoneyReceipt !== null
      ? this.LastMoneyReceipt.receiptNumber : '');
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
    const payDatePicker = {
      year: Number(payDateSplit[2]),
      month: Number(payDateSplit[1]), day: Number(payDateSplit[0]),
    };
    return this.fb.group({
      id: [0],
      amount: [0, [Validators.required]],
      receiptNumber: ['', [Validators.required]],
      supplierName: [''],
      receiverName: ['', [Validators.required]],
      entryType: [null, Validators.required],
      paymentMethods: [null, [Validators.required]],
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
    const Datasession = JSON.parse(sessionStorage.getItem('credentials'));
      if (this.moneyReceipt.value.id > 0) {
        const request = {
          yourCompanyAddress: Datasession.companyProfile[0].address,
          companyCode: Datasession.companyProfile[0].code,
          address: this.address,
          yourCompanyName: Datasession.companyProfile[0].companyName,
          amount: this.moneyReceipt.value.amount,
          bankAccount: this.moneyReceipt.value.bankAccount,
          supplierID: this.moneyReceipt.value.supplierID,
          supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
            ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
          entryType: this.moneyReceipt.value.entryType,
          note: this.moneyReceipt.value.note,
          payDate: payDateData,
          payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
          payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
          receiptNumber: this.moneyReceipt.value.receiptNumber,
          receiverName: this.moneyReceipt.value.receiverName,
          id: this.moneyReceipt.value.id,
        };
        this.requestSaveJson.push(request);
        const reportName = 'Payment Receipt';
        this.paymentReceiptService.paymentReceiptSaveDataPrint(this.requestSaveJson).subscribe(rp1 => {
          this.router.navigate([`/pages/print/${reportName}`]);
          this.modalService.dismissAll();
          return;
        });
      }
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
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreatePaymentReceiptRequestList;
      this.paymentReceiptService.createPaymentReceiptPayMent(requestList).subscribe(rp => {
        this.notify.info('Saved Successfully');
        this.isSave = true;
      });
    } else if (this.moneyReceipt.value.id === 0 || this.coppyMode) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        supplierID: this.moneyReceipt.value.supplierID,
        supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
          ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreatePaymentReceiptRequest;
      this.paymentReceiptService.createPaymentReceipt(request).subscribe(rp => {
        this.notify.info(!this.coppyMode ? 'Saved Successfully' : 'Duplicate Successfully');
        this.isSave = true;
      });
    } else if (this.moneyReceipt.value.id > 0 && !this.coppyMode) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        supplierID: this.moneyReceipt.value.supplierID,
        supplierName: this.moneyReceipt.value.supplierName.supplierName !== undefined
          ? this.moneyReceipt.value.supplierName.supplierName : this.moneyReceipt.value.supplierName,
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id,
      } as CreatePaymentReceiptRequest;
      this.paymentReceiptService.updatePaymentReceipt(request).subscribe(rp => {
        this.notify.info('update Successfully');
        this.isSave = true;
      });
    }
  }
}
