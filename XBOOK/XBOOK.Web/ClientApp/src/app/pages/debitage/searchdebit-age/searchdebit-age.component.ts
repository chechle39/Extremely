import { Component, OnInit, Injector } from '@angular/core';
import { GenLedMethod } from '../../_shared/models/invoice/genled-method.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyMethod } from '../../_shared/models/invoice/currency-method.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { AcountNumberMethod } from '../../_shared/models/invoice/accountnumber-method.model';
import { AccountChartService } from '../../_shared/services/accountchart.service';
import * as moment from 'moment';
import { AppConsts } from '../../../coreapp/app.consts';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'xb-searchgenled',
  templateUrl: './searchdebit-age.component.html' ,
  styleUrls: ['./searchdebit-age.component.scss']
})

export class SearchDebitAgeComponent extends AppComponentBase implements OnInit {
  cars: any[];
  tempcars: AcountNumberMethod[];
  selectedCars1: string[] = [];

  selectedCars2: string[] = [];

  items: SelectItem[];

  item: string;
  public genLedForm: FormGroup;
  isSelectedAccount = false;
  isSelectedCrspAccount = false;
  genLedMethods = [
    new GenLedMethod(1, 'Hôm nay'),
    new GenLedMethod(2, 'Cuối tháng trước'),
    new GenLedMethod(3, 'Cuối quý trước'),
    new GenLedMethod(4, 'Cuối năm trước'),
    new GenLedMethod(5, 'Tùy chọn'),
  ];
  currencyMethod = [
    new CurrencyMethod(1, 'VND'),
    new CurrencyMethod(2, 'USD'),
  ];
  acountNumberMethod: AcountNumberMethod[];
  fromDate: any;
  firstDate: any;
  endDate: string;
  case6: any;
  constructor(
    public accountChartService: AccountChartService,
    public fb: FormBuilder,
    injector: Injector,
    public activeModal: NgbActiveModal, ) {
    super(injector);
    this.genLedForm = this.createGenLedFormGroup();
  }

  ngOnInit() {
    this.accountChartService.searchAcc().subscribe(rp => {
      this.cars = rp;
      this.tempcars = rp;
      this.items = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cars.length; i++) {
        this.items.push({ label: this.cars[i].accountNumber + '-' + this.cars[i].accountName, value: this.cars[i].accountNumber });
      }
      this.cars = this.items;

    });
  }

  createGenLedFormGroup() {
    const today = new Date().toLocaleDateString('en-GB');
    const issueDatePicker = this.tranFormsDate(today);
    return this.fb.group({
      genLedMethods: this.genLedMethods[0].GenLedId,
      currencyMethod: this.currencyMethod[0].CurrencyId,
      fromDate: issueDatePicker,
      toDate: issueDatePicker,
      account: this.isSelectedAccount = true,
      accountReciprocal: null,
      acountNumberMethod: [null],

    });
  }

  private tranFormsDate(today: string) {
    const issueDateSplit = today.split('/');
    const issueDatePicker = { year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
    return issueDatePicker;
  }

  close(e: boolean): void {
    if (e === true) {
      if (this.genLedForm.value.genLedMethods === 5) {
        const dateFrom = moment([this.genLedForm.value.fromDate.year,
        this.genLedForm.value.fromDate.month - 1, this.genLedForm.value.fromDate.day])
          .format(AppConsts.defaultDateFormat);
        const endFrom = moment([this.genLedForm.value.toDate.year, this.genLedForm.value.toDate.month - 1,
        this.genLedForm.value.toDate.day]).format(AppConsts.defaultDateFormat);
        this.firstDate = dateFrom;
        this.endDate = dateFrom;
      }
      if (this.genLedForm.value.genLedMethods === 1) {
        const date = new Date();
        this.firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
      }
      const genledSearch = {
        startDate: this.endDate === undefined ? null : this.firstDate,
        endDate: this.endDate === undefined ? null : this.endDate,
        isaccount: this.genLedForm.value.account,
        isAccountReciprocal: this.genLedForm.value.accountReciprocal,
        money: null,
        accNumber: this.genLedForm.value.acountNumberMethod,
        case: this.genLedForm.value.genLedMethods
      };

      this.activeModal.close(genledSearch);
    } else {
      this.activeModal.close();
    }
  }
  onChange(e: any) {
    const date = new Date();
    this.case6 = 0;
    switch (this.genLedForm.value.genLedMethods) {
      case 1: {
        this.firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 2: {
        this.firstDate = new Date(date.getFullYear() - 1, 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth(), 0).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 3: {
        const quarter = Math.floor((date.getMonth() / 3));
        const firstDay = new Date(date.getFullYear(), quarter * 3 - 3, 1);
        const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
        this.firstDate = firstDay.toLocaleDateString('en-GB');
        this.endDate = lastDay.toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 4: {
        this.firstDate = new Date(date.getFullYear() - 1, 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(new Date().getFullYear() - 1, 11, 31).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 5: {
        return this.case6 = this.genLedForm.value.genLedMethods;
        break;
      }
      default: {
        break;
      }
    }
  }
}
