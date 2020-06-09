import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { Observable, Subject, merge, of, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ClientService } from '../../_shared/services/client.service';
import { ClientSearchModel } from '../../_shared/models/client/client-search.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MoneyReceiptService } from '../../_shared/services/money-receipt.service';
import { MoneyReceiptViewModel } from '../../_shared/models/money-receipt/money-receipt.model';
import { InvoiceService } from '../../_shared/services/invoice.service';
import {
  CreateMoneyReceiptRequest,
  CreateMoneyReceiptRequestList,
} from '../../_shared/models/money-receipt/create-money-receipt-request.model';
import * as _ from 'lodash';
import { MasterParamModel } from '../../_shared/models/masterparam.model';
import { MasterParamService } from '../../_shared/services/masterparam.service';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { DataService } from '../../_shared/services/data.service';
@Component({
  selector: 'xb-create-money-receipt',
  templateUrl: './create-money-receipt.component.html',
  styleUrls: ['./create-money-receipt.component.scss'],
})
export class CreateMoneyReceiptComponent extends AppComponentBase implements OnInit {
  @Input() payment: MasterParamModel[];
  @Input() moneyById: any;
  @Input() entryBatternList: MasterParamModel[];
  @Input() LastMoneyReceipt: MoneyReceiptViewModel;
  @Input() title: string;
  @Input() note: string;
  @Input() outstandingAmount: any;
  @Input() invoice: any;
  @Input() clientId: any;
  @Input() clientName: any;
  @Input() contactName: any;
  @Input() bankAccount: any;
  @Input() row: any;
  @Input() masTerByPayType;
  @Input() masTerByMoney;
  @Input() coppyMode: boolean = false;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  address: any;
  companyName: any;
  companyAddress: any;
  companyCode: any;
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new ClientSearchModel();
  receiptNumber: string;
  money: number;
  inVoiceList: any = [];
  public moneyReceipt: FormGroup;
  isSave: boolean;
  constructor(
    injector: Injector,
    private router: Router,
    public activeModal: NgbActiveModal,
    public authenticationService: AuthenticationService,
    private clientService: ClientService,
    private invoiceService: InvoiceService,
    private modalService: NgbModal,
    private moneyReceiptService: MoneyReceiptService,
    public fb: FormBuilder) {
    super(injector);
    this.moneyReceipt = this.createMoneyReceiptFormGroup();
  }

  ngOnInit() {
    this.getDataPayAndEntry();
    if (this.outstandingAmount !== undefined) {
      this.moneyReceipt.controls.amount.patchValue(this.outstandingAmount);
      this.moneyReceipt.controls.clienId.patchValue(this.clientId);
      this.moneyReceipt.controls.clientName.patchValue(this.clientName);
      this.moneyReceipt.controls.receiverName.patchValue(this.contactName);
      this.moneyReceipt.controls.bankAccount.patchValue(this.bankAccount);
      this.moneyReceipt.controls.note.patchValue(this.note);
      const data = {
        clientName: this.clientName,
        contactName: this.moneyReceipt.value.receiverName,
        clientId: this.clientId,
        bankAccount: this.bankAccount,
      } as ClientSearchModel;
      this.clientSelected = data;
    }
    if (this.row !== undefined) {
      const today = new Date(this.moneyById.payDate).toLocaleDateString('en-GB');
        const payDateSplit = today.split('/');
        const payDatePicker = {
          year: Number(payDateSplit[2]),
          month: Number(payDateSplit[1]), day: Number(payDateSplit[0]),
        };
        this.address = this.moneyById.address;
        this.moneyReceipt.controls.id.patchValue(this.moneyById.id);
        this.moneyReceipt.controls.amount.patchValue(this.moneyById.amount);
        this.moneyReceipt.controls.receiptNumber.patchValue(!this.coppyMode ? this.moneyById.receiptNumber
          : this.LastMoneyReceipt.receiptNumber);
        this.moneyReceipt.controls.receiverName.patchValue(this.moneyById.receiverName);
        this.moneyReceipt.controls.clientName.patchValue(this.moneyById.clientName);
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList.filter(x => x.key
          === this.row.entryType)[0].key);
        this.moneyReceipt.controls.paymentMethods.patchValue(this.moneyById.payType);
        this.moneyReceipt.controls.payDate.patchValue(payDatePicker);
        this.moneyReceipt.controls.bankAccount.patchValue(this.moneyById.bankAccount);
        this.moneyReceipt.controls.note.patchValue(this.moneyById.note);
        this.moneyReceipt.controls.clienId.patchValue(this.moneyById.clientID);

        const data = {
          clientName: this.moneyReceipt.value.clientName,
          contactName: this.moneyReceipt.value.receiverName,
          clientId: this.moneyReceipt.value.clienId,
          bankAccount: this.moneyReceipt.value.bankAccount,
        } as ClientSearchModel;
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
    // tslint:disable-next-line:prefer-for-of
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
      if (this.outstandingAmount !== undefined) {
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList.filter(x => x.name
          === 'Thu tiền bán hàng')[0].key);
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
        this.clientService.searchClient(this.requestClient(term)).pipe(
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
    const payDatePicker = {
      year: Number(payDateSplit[2]),
      month: Number(payDateSplit[1]), day: Number(payDateSplit[0]),
    };
    return this.fb.group({
      id: [0],
      amount: [0, [Validators.required]],
      receiptNumber: ['', [Validators.required]],
      clientName: [''],
      receiverName: ['', [Validators.required]],
      entryType: [null, Validators.required],
      paymentMethods: [null, [Validators.required]],
      payDate: payDatePicker,
      bankAccount: [''],
      note: [''],
      clienId: [''],
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
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreateMoneyReceiptRequestList;
      this.moneyReceiptService.createMoneyReceiptPayMent(requestList).subscribe(rp => {
        this.isSave = true;
        this.notify.info('Saved Successfully');
       // this.close(false);
      });
    } else if (this.moneyReceipt.value.id === 0 || this.coppyMode) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
          ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
      } as CreateMoneyReceiptRequest;
      this.moneyReceiptService.createMoneyReceipt(request).subscribe(rp => {
        this.isSave = true;
        this.notify.info(!this.coppyMode ? 'Saved Successfully' : 'Duplicate Successfully');
      //  this.close(false);
      });
    } else if (this.moneyReceipt.value.id > 0 && !this.coppyMode) {
      const request = {
        amount: this.moneyReceipt.value.amount,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
          ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.entryBatternList.filter(x => x.key === this.moneyReceipt.value.entryType)[0].key,
        note: this.moneyReceipt.value.note,
        payDate: payDateData,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payName: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].name,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id,
      } as CreateMoneyReceiptRequest;
      this.moneyReceiptService.updateMoneyReceipt(request).subscribe(rp => {
        this.isSave = true;
        this.notify.info('update Successfully');
      //  this.close(false);
      });
    }
  }


  // Print
  Print() {
    const Datasession = JSON.parse(sessionStorage.getItem('credentials'));
      const payDate = this.moneyReceipt.value.payDate;
      const payDateData = [payDate.year, payDate.month, payDate.day].join('-');
      const request = {
        amount: this.moneyReceipt.value.amount,
        yourCompanyAddress: Datasession.companyProfile[0].address,
        yourCompanyName: Datasession.companyProfile[0].companyName,
        companyCode: Datasession.companyProfile[0].code,
        payDate: payDateData,
        address: this.address,
        bankAccount: this.moneyReceipt.value.bankAccount,
        clientID: this.moneyReceipt.value.clienId,
        clientName: this.moneyReceipt.value.clientName.clientName !== undefined
          ? this.moneyReceipt.value.clientName.clientName : this.moneyReceipt.value.clientName,
        entryType: this.moneyReceipt.value.entryType,
        note: this.moneyReceipt.value.note,
        payType: this.payment.filter(x => x.key === this.moneyReceipt.value.paymentMethods)[0].key,
        payTypeID: 1,
        receiptNumber: this.moneyReceipt.value.receiptNumber,
        receiverName: this.moneyReceipt.value.receiverName,
        id: this.moneyReceipt.value.id,
      };
      const reportName = 'Money Receipt';
      this.moneyReceiptService.MoneyReceiptSaveDataPrint(request).subscribe(re => {
        this.router.navigate([`/pages/print/${reportName}`]);
        this.modalService.dismissAll();
        return;
      });
  }
}
