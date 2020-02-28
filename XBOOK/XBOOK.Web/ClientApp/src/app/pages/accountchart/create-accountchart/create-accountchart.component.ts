import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '../../_shared/models/product/product-view.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcountChartViewModel } from '../../_shared/models/accountchart/account-chart.model';
import { AccountChartService } from '../../_shared/services/accountchart.service';

@Component({
  selector: 'xb-create-accountchart',
  templateUrl: './create-accountchart.component.html'
})
export class CreateAccountChartComponent extends AppComponentBase implements OnInit {

  @Input() data;
  @Input() row;
  @Input() categoryId;
  @Input() listCategory;
  public accountChartForm: FormGroup;
  saving: false;
  categories: any;
  statusCategory: any;
  product: ProductView = new ProductView();
  type: any;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    private accountChartService: AccountChartService,
    ) {
    super(injector);
  }

  ngOnInit() {
    if (this.row === undefined) {
      this.accountChartForm = this.createAccountChartFormGroup();
      this.accountChartForm.controls.accountNumber.disable();
    } else
      if (this.row !== undefined) {
        this.accountChartForm = this.createAccountChartFormGroup();
        this.accountChartForm.controls.accountMethods.disable();
        this.accountChartForm.controls.accountNumber.disable();
        this.accountChartForm.controls.plusString.disable();
        this.accountChartForm.patchValue({
          accountName: this.row.accountName,
          accountMethods: this.row.parentAccount,
          accountNumber: this.row.accountNumber,
          parentAccount: this.row.parentAccount,
          plusString: this.row.parentAccount === null ? null : this.row.accountNumber.substring(this.row.parentAccount.length),
          type: this.row.accountType
        });
      }
  }
  createAccountChartFormGroup() {

    return this.fb.group({
      accountName: ['', [Validators.required]],
      accountMethods: [null],
      accountNumber: [''],
      parentAccount: [null],
      plusString: [''],
      type: [null]
    });
  }

  onChange() {
    this.accountChartForm.controls.accountNumber.patchValue(this.accountChartForm.value.accountMethods);
    const filter = this.data.filter(x => x.parentAccount === this.accountChartForm.value.accountMethods);
    if (filter.length > 0) {
      const dataFilter = filter[filter.length - 1];
      const plusString = this.inputString(dataFilter.accountNumber.substring(dataFilter.parentAccount.length));
      this.accountChartForm.controls.plusString.patchValue(plusString);
      this.accountChartForm.controls.parentAccount.patchValue(dataFilter.accountNumber);
      this.type = dataFilter.accountType;
      this.accountChartForm.controls.type.patchValue(dataFilter.accountType);
    } else {
      const filter1 = this.data.filter(x => x.accountNumber === this.accountChartForm.value.accountMethods);
      const dataFilter = filter1[filter1.length - 1];
      this.accountChartForm.controls.plusString.patchValue(1);
      this.accountChartForm.controls.parentAccount.patchValue(dataFilter.accountNumber);
      this.type = dataFilter.accountType;

      this.accountChartForm.controls.type.patchValue(dataFilter.accountType);
    }

  }

  saveAccount(submittedForm: FormGroup): void {
    const request = {
      accountName: submittedForm.controls.accountName.value,
      accountNumber: this.row !== undefined
      ? submittedForm.controls.accountNumber.value : submittedForm.controls.accountNumber.value + submittedForm.controls.plusString.value,
      isParent: false,
      accountType: submittedForm.controls.type.value,
      parentAccount: submittedForm.controls.accountMethods.value,
      closingBalance: 0,
      openingBalance: 0
    } as AcountChartViewModel;
    if (this.row === undefined) {
      this.accountChartService.createAccountChart(request).subscribe(rp => {
        this.notify.info('Saved Successfully');
        this.close(true);
      }, () => {
        this.notify.error('Error');
      });
    } else {
      this.accountChartService.updateAccountChart(request).subscribe(rp => {
        this.notify.info('Update Successfully');
        this.close(true);
      }, () => {
        this.notify.error('Error');
      });
    }
  }
  close(result: any): void {
    this.activeModal.close(result);
  }

  inputString(value) {
    let carry = 1;
    let res = '';
    // tslint:disable-next-line:no-conditional-assignment
    for (let i = value.length - 1; i > 0; i--) {
      let chars = 0;
      chars += value[i].charCodeAt(0);
      chars += carry;
      if (chars > 90) {
        chars = 65;
        carry = 1;
      } else {
        carry = 0;
      }

      if (chars > 57 && chars < 65) {
        carry = 1;
      }

      res = String.fromCharCode(chars) + res;

      if (carry !== 1) {
        res = value.substring(0, i) + res;
        break;
      }
    }
    // if (carry === 1) {
    //   res = 'A' + res;
    // }
    if (value.length === 1) {
      let chars = 0;
      chars += value.charCodeAt(0);
      chars += carry;
      res = String.fromCharCode(chars) + res;
    }
    const resStr = res.replace(':', '0');
    return resStr;
  }
}
