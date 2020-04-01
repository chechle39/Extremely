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
import { Observable, Subject, merge, of } from 'rxjs';
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
  @Input() title = 'Add a payment';
  @Input() outstandingAmount: any;
  @Input() invoice: any;
  @Input() clientId: any;
  @Input() clientName: any;
  @Input() contactName: any;
  @Input() bankAccount: any;
  @Input() row: any;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  payment: MasterParamModel[];
  address: any;
  companyName: any;
  companyAddress: any;
  companyCode: any;
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new ClientSearchModel();
  LastMoneyReceipt: MoneyReceiptViewModel;
  receiptNumber: string;
  entryBatternList: MasterParamModel[];
  money: number;
  inVoiceList: any = [];
  public moneyReceipt: FormGroup;

  constructor(
    injector: Injector,
    private router: Router,
    public activeModal: NgbActiveModal,
    private data: DataService,
    public authenticationService: AuthenticationService,
    private clientService: ClientService,
    private invoiceService: InvoiceService,
    private modalService: NgbModal,
    private moneyReceiptService: MoneyReceiptService,
    private masterParamService: MasterParamService,
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
        bankAccount: this.bankAccount,
      } as ClientSearchModel;
      this.clientSelected = data;
    }
    if (this.row !== undefined) {
      this.moneyReceiptService.getMoneyReceiptById(this.row.id).subscribe(rp => {
        this.masterParamService.GetMasTerByMoneyReceipt().subscribe((rpx: MasterParamModel[]) => {
          this.entryBatternList = rpx;
          const today = new Date(rp.payDate).toLocaleDateString('en-GB');
        const payDateSplit = today.split('/');
        const payDatePicker = {
          year: Number(payDateSplit[2]),
          month: Number(payDateSplit[1]), day: Number(payDateSplit[0]),
        };
        this.address = rp.address;
        this.moneyReceipt.controls.id.patchValue(rp.id);
        this.moneyReceipt.controls.amount.patchValue(rp.amount);
        this.moneyReceipt.controls.receiptNumber.patchValue(rp.receiptNumber);
        this.moneyReceipt.controls.receiverName.patchValue(rp.receiverName);
        this.moneyReceipt.controls.clientName.patchValue(rp.clientName);
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList.filter(x => x.key
          === this.row.entryType)[0].key);
        this.moneyReceipt.controls.paymentMethods.patchValue(rp.payType);
        this.moneyReceipt.controls.payDate.patchValue(payDatePicker);
        this.moneyReceipt.controls.bankAccount.patchValue(rp.bankAccount);
        this.moneyReceipt.controls.note.patchValue(rp.note);
        this.moneyReceipt.controls.clienId.patchValue(rp.clientID);

        const data = {
          clientName: this.moneyReceipt.value.clientName,
          contactName: this.moneyReceipt.value.receiverName,
          clientId: this.moneyReceipt.value.clienId,
          bankAccount: this.moneyReceipt.value.bankAccount,
        } as ClientSearchModel;
        this.clientSelected = data;
        });

      });

    }
    if (this.row === undefined) {
      this.getLastDataMoneyReceipt();
      this.getAllEntryData();
    }
    this.getPayType();
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

  getLastDataMoneyReceipt() {
    this.moneyReceiptService.getLastMoney().subscribe(rp => {
      this.LastMoneyReceipt = rp;
      this.moneyReceipt.controls.receiptNumber.patchValue(rp.receiptNumber);
    });
  }
  getPayType() {
    this.masterParamService.GetMasTerByPayType().subscribe(rp => {
      this.payment = rp;
      if (this.row === undefined) {
        this.moneyReceipt.controls.paymentMethods.patchValue(this.payment[0].key);
      } else {
        // const entry = this.payment.filter(x => x.name === this.row.payType);
        // this.moneyReceipt.controls.paymentMethods.patchValue(entry[0].key);
      }
    });
  }
  getAllEntryData() {
    this.masterParamService.GetMasTerByMoneyReceipt().subscribe((rp: MasterParamModel[]) => {
      this.entryBatternList = rp;
      if (this.row === undefined) {
        this.moneyReceipt.controls.entryType.patchValue(this.entryBatternList[0].key);
      } else {
        const entry = this.entryBatternList.filter(x => x.name === this.row.entryType);
        // this.moneyReceipt.controls.entryType.patchValue(entry[0].key);
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
        this.notify.info('Saved Successfully');
        this.close(false);
      });
    } else if (this.moneyReceipt.value.id === 0) {
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
        companyCode: rp.code,
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
    });

  }
}
