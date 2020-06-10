import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '../../../../../coreapp/app-base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethod } from '../../../../_shared/models/invoice/payment-method.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentView } from '../../../../_shared/models/invoice/payment-view.model';
import { PaymentService } from '../../../../_shared/services/payment.service';
import { finalize } from 'rxjs/operators';
import { MoneyReceiptService } from '../../../../_shared/services/money-receipt.service';
import { AuthenticationService } from '../../../../../coreapp/services/authentication.service';
import { MasterParamModel } from '../../../../_shared/models/masterparam.model';
import { MasterParamService } from '../../../../_shared/services/masterparam.service';
@Component({
  selector: 'xb-add-payment',
  templateUrl: './add-payment.component.html',
})
export class AddPaymentComponent extends AppComponentBase implements OnInit {
  public paymentForm: FormGroup;
  @Input() row: any;
  @Input() title = 'Add a payment';
  @Input() outstandingAmount: any;
  @Input() invoiceId: number;
  @Input() id: number;
  @Input() amountPaid: any;
  @Input() invoiceList: any;
  payment: MasterParamModel[];
  // paymentMethods = [
  //   new PaymentMethod(1, 'Cash'),
  //   new PaymentMethod(2, 'Visa card'),
  //   new PaymentMethod(3, 'Bank transfer'),
  // ];
  saving: boolean;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public paymentService: PaymentService,
    public authenticationService: AuthenticationService,
    private moneyReceiptService: MoneyReceiptService,
    private masterParamService: MasterParamService,
    public fb: FormBuilder) {
    super(injector);
    this.paymentForm = this.createPaymentFormGroup();
  }

  ngOnInit() {
    if (this.id !== undefined || this.id > 0) {
      this.getPaymentDetail(this.id);
    }
    this.paymentForm = this.createPaymentFormGroup();
    if (this.id === undefined) {
      this.getPayType();
    }

  }

  getLastDataMoneyReceipt() {
    this.moneyReceiptService.getLastMoney().subscribe(rp => {
      // this.receiptNumber = rp.receiptNumber;
      this.paymentForm.controls.bankAccount.patchValue(rp.receiptNumber);
    });
  }

  createPaymentFormGroup() {
    const today = new Date().toLocaleDateString('en-GB');
    const issueDateSplit = today.split('/');
    const issueDatePicker = { year: Number(issueDateSplit[2]),
      month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
    return this.fb.group({
      id: [0],
      amount: this.outstandingAmount === undefined
        ? ['', [Validators.required]] : [this.outstandingAmount.toString(), [Validators.required]],
      paymentMethods: [null],
      payDate: issueDatePicker,
      bankAccount: [''],
      note: [''],
    });
  }

  getPayType() {
    this.masterParamService.GetMasTerByPayType().subscribe(rp => {
      this.payment = rp;
      if (this.row === undefined) {
        this.paymentForm.controls.paymentMethods.patchValue(this.payment[0].key);
      } else {
        // const entry = this.payment.filter(x => x.name === this.row.payType);
        // this.moneyReceipt.controls.paymentMethods.patchValue(entry[0].key);
      }
    });
  }

  getPaymentToSave(submittedForm: FormGroup): PaymentView {
    // tslint:disable-next-line: no-unused-expression
    const payment = new PaymentView();
    payment.id = submittedForm.controls.id.value;
    payment.invoiceId = this.invoiceId;
    payment.amount = Number(submittedForm.controls.amount.value.toString().replace(/,/g, ''));
    payment.receiptNumber = submittedForm.controls.bankAccount.value;
    const paymentDate = submittedForm.controls.payDate.value;
    payment.payDate = [paymentDate.year, paymentDate.month, paymentDate.day].join('-');
    const paymentMethodId = submittedForm.controls.paymentMethods.value;
    // payment.key = paymentMethodId;
    payment.payType = this.payment.find(x => x.key === paymentMethodId).key;
    payment.note = submittedForm.controls.note.value;
    payment.payName = this.payment.find(x => x.key === paymentMethodId).name;
    return payment;
  }

  getPaymentDetail(id: number) {
    this.paymentService.getPayment(id).pipe(
      finalize(() => {
      })).subscribe((payment: any) => {
        this.masterParamService.GetMasTerByPayType().subscribe(rp => {
          this.payment = rp;
          this.paymentForm.patchValue({
            amount: payment.amount,
            bankAccount: payment.receiptNumber,
            note: payment.note,
          });
          this.paymentForm.controls.paymentMethods.patchValue(this.payment.filter(x =>
            x.key === payment.payType)[0].key);
          if (payment.payDate !== '') {
            const payDateSplit = payment.payDate.split('-');
            const dayx = payDateSplit[2].substring(0, 2);
            const payDate = { year: Number(payDateSplit[0]), month: Number(payDateSplit[1]), day: Number(dayx) };
            this.paymentForm.controls.payDate.patchValue(payDate);
          }
        });

      });
  }
  savePayment(submittedForm: FormGroup): void {
    if (!this.paymentForm.valid) {
      return;
    }
     const payment = this.getPaymentToSave(submittedForm);
    if (this.id !== undefined || this.id > 0) {
      payment.id = this.id;
      this.paymentService
        .updatePayment(payment)
        .pipe(
          finalize(() => {
            this.saving = false;
          }),
        )
        .subscribe(() => {
          this.notify.info('Updated Successfully');
          this.close(this.paymentForm.value);
        });
    } else {
      this.paymentService
        .createPayment(payment)
        .pipe(
          finalize(() => {
            this.saving = false;
          }),
        )
        .subscribe(() => {
          this.notify.info('Saved Successfully');
          this.close(this.paymentForm.value);
        });
    }
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }
}