import { Component, OnInit, Injector } from '@angular/core';
import { GenLedMethod } from '../../_shared/models/invoice/genled-method.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyMethod } from '../../_shared/models/invoice/currency-method.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ProductService } from '../../_shared/services/product.service';
import { SupplierService } from '../../_shared/services/supplier.service';
import * as moment from 'moment';
import { AppConsts } from '../../../coreapp/app.consts';
import { SelectItem } from 'primeng/components/common/selectitem';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-searchpurchase',
  templateUrl: './searchpurchase-report.component.html',
  styleUrls: ['./searchpurchase-report.component.scss'],
})
export class SearchPurchaseReportComponent extends AppComponentBase implements OnInit {
  cars: any[];
  cars1: any[];
  client: any[];
  clientViews: any;
  clientViews1: any[] = [];

  selectedCars1: string[] = [];

  selectedCars2: string[] = [];

  items: SelectItem[];
  items1: SelectItem[];
  item: string;
  item1: string;
  public genLedForm: FormGroup;
  isSelectedAccount = false;
  isSelectedCrspAccount = false;
  genLedMethods = [
    new GenLedMethod(1, 'Tháng này'),
    new GenLedMethod(2, 'Quý này'),
    new GenLedMethod(3, 'Năm này'),
    new GenLedMethod(4, 'Quý trước'),
    new GenLedMethod(5, 'Năm trước'),
    new GenLedMethod(6, 'Tùy chọn'),
  ];
  currencyMethod = [
    new CurrencyMethod(1, 'VND'),
    new CurrencyMethod(2, 'USD'),
  ];
  fromDate: any;
  firstDate: any;
  endDate: string;
  term: any;
  case6: any;
  constructor(
    public productService: ProductService,
    public clientService: SupplierService,
    public fb: FormBuilder,
    injector: Injector,
    public activeModal: NgbActiveModal ) {
    super(injector);
    this.genLedForm = this.createGenLedFormGroup();
  }

  ngOnInit() {

    const request = {
      productKeyword: null,
      isGrid: false,
    };
    const requestClient = {
      productKeyword: null,
    };
    this.clientService
      .searchSupplier(requestClient)
      .subscribe(i => {
        this.clientViews = i;
        this.items1 = [];
        this.clientViews1 = this.clientViews;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.clientViews1.length; j++) {
          this.items1.push({ label: this.clientViews1[j].supplierName, value: this.clientViews1[j].supplierName });
        }
        this.cars1 = this.items1;
      });
    this.productService.searchProductForSearch(request).subscribe(rp => {
      this.cars = rp;
      this.items = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cars.length; i++) {
        this.items.push({ label: this.cars[i].productName, value: this.cars[i].productName });
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
      acountNumberMethod1: [null],
    });
  }

  private tranFormsDate(today: string) {
    const issueDateSplit = today.split('/');
    // tslint:disable-next-line:max-line-length
    const issueDatePicker = { year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
    return issueDatePicker;
  }

  close(e: boolean): void {
    if (e === true) {
      if (this.genLedForm.value.genLedMethods === 6) {
        const dateFrom = moment([this.genLedForm.value.fromDate.year,
        this.genLedForm.value.fromDate.month - 1, this.genLedForm.value.fromDate.day])
          .format(AppConsts.defaultDateFormat);
        const endFrom = moment([this.genLedForm.value.toDate.year, this.genLedForm.value.toDate.month - 1,
        this.genLedForm.value.toDate.day]).format(AppConsts.defaultDateFormat);
        this.firstDate = dateFrom;
        this.endDate = endFrom;
      }
      if (this.genLedForm.value.genLedMethods === 1) {
        const date = new Date();
        this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
      }
      let supplier = '';
      // tslint:disable-next-line:prefer-for-of
      if (this.genLedForm.value.acountNumberMethod1 !== null) {
        for (let i = 0; i < this.genLedForm.value.acountNumberMethod1.length; i++) {
          supplier +=  this.genLedForm.value.acountNumberMethod1[i] + ';' ;
        }
      }
      let product = '';
      if (this.genLedForm.value.acountNumberMethod !== null) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.genLedForm.value.acountNumberMethod.length; i++) {
        product +=  this.genLedForm.value.acountNumberMethod[i] + ';';
      }
    }
      const genledSearch = {
        startDate: this.firstDate === undefined ? null : this.firstDate,
        endDate: this.endDate === undefined ? null : this.endDate,
        client: supplier,
        product: product,
        case: this.genLedForm.value.genLedMethods,
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
        this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 2: {
        const quarter = Math.floor((date.getMonth() / 3));
        const firstDay = new Date(date.getFullYear(), quarter * 3, 1);
        const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
        this.firstDate = firstDay.toLocaleDateString('en-GB');
        this.endDate = lastDay.toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 3: {
        this.firstDate = new Date(date.getFullYear(), 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 4: {

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
      case 5: {
        this.firstDate = new Date(date.getFullYear() - 1, 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(new Date().getFullYear() - 1, 11, 31).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        });
        break;
      }
      case 6: {
        return this.case6 = this.genLedForm.value.genLedMethods;
        break;
      }
      default: {
        break;
      }
    }
  }
}
