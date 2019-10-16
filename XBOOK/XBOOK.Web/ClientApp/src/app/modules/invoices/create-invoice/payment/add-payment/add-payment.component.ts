import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethod } from '@modules/_shared/models/invoice/payment-method.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentView } from '@modules/_shared/models/invoice/payment-view.model';
import * as moment from 'moment';
import { AppConsts } from '@core/app.consts';
import { PaymentService } from '@modules/_shared/services/payment.service';
import { finalize, debounceTime } from 'rxjs/operators';
@Component({
  selector: 'xb-add-payment',
  templateUrl: './add-payment.component.html',
})
export class AddPaymentComponent extends AppComponentBase implements OnInit {
  public paymentForm: FormGroup;
  @Input() title = 'Add a payment';
  @Input() outstandingAmount = 0;
  @Input() invoiceId: number;
  @Input() id: number;
  paymentMethods = [
    new PaymentMethod(1, 'Cash'),
    new PaymentMethod(2, 'Visa card'),
    new PaymentMethod(3, 'Bank transfer')
  ];
  saving: boolean;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public paymentService: PaymentService,
    public fb: FormBuilder) {
    super(injector);
    this.paymentForm = this.createPaymentFormGroup();
  }

  ngOnInit() {
    if (this.id !== undefined || this.id > 0) {
      this.getPaymentDetail(this.id);
    }
  }
  createPaymentFormGroup() {
    return this.fb.group({
      id: [0],
      amount: ['', [Validators.required]],
      paymentMethods: [null, [Validators.required]],
      payDate: ['', [Validators.required]],
      bankAccount: [''],
      note: ['']
    });
  }
  getPaymentToSave(submittedForm: FormGroup): PaymentView {
    // tslint:disable-next-line: no-unused-expression
    const payment = new PaymentView();
    payment.id = submittedForm.controls.id.value;
    payment.invoiceId = this.invoiceId;
    payment.amount = Number(submittedForm.controls.amount.value.toString().replace(/,/g, ''));
    payment.bankAccount = submittedForm.controls.bankAccount.value;
    const paymentDate = submittedForm.controls.payDate.value;
    payment.payDate = [paymentDate.year, paymentDate.month - 1, paymentDate.day].join('-');
    const paymentMethodId = submittedForm.controls.paymentMethods.value;
    payment.payTypeId = paymentMethodId;
    payment.payType = this.paymentMethods.find(x => x.payTypeId === paymentMethodId).payType;
    payment.note = submittedForm.controls.note.value;
    return payment;
  }
  getPaymentDetail(id: number) {
    this.paymentService.getPayment(id).pipe(debounceTime(500), finalize(() => {
    })).subscribe((payment: any) => {
      this.paymentForm.patchValue({
        amount: payment.amount,
        bankAccount: payment.bankAccount,
        note: payment.note,
        paymentMethod: payment.payTypeID
      });

      this.paymentForm.controls.paymentMethods.patchValue(payment.payTypeID);
      if (payment.payDate !== '') {
        const payDateSplit = payment.payDate.split('-');
        const dayx = payDateSplit[2].substring(0, 2);
        const payDate = { 'year': Number(payDateSplit[0]), 'month': Number(payDateSplit[1]), 'day': Number(dayx) };
        this.paymentForm.controls.payDate.patchValue(payDate);
      }
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
          })
        )
        .subscribe(() => {
          this.notify.info('Updated Successfully');
          this.close(true);
        });
    } else {
      this.paymentService
      .createPayment(payment)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Saved Successfully');
        this.close(true);
      });
    }
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }
}

