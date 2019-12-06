import { Component, OnInit, Injector } from '@angular/core';
import { GenLedMethod } from '@modules/_shared/models/invoice/genled-method.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyMethod } from '@modules/_shared/models/invoice/currency-method.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@core/app-base.component';
import { AcountNumberMethod } from '@modules/_shared/models/invoice/accountnumber-method.model';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import * as moment from 'moment';
import { AppConsts } from '@core/app.consts';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'xb-searchgenled',
  templateUrl: './searchgenled.component.html',
  styleUrls: ['./searchgenled.component.scss']
})
export class SearchgenledComponent extends AppComponentBase implements OnInit {
  cars: any[];
  tempcars: AcountNumberMethod[];
  selectedCars1: string[] = [];

  selectedCars2: string[] = [];

  items: SelectItem[];

  item: string;

  
  public genLedForm: FormGroup;
  isSelectedAccount: boolean = false;
  isSelectedCrspAccount: boolean = false;
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
      this.tempcars=rp;
      this.items = [];
      for (let i = 0; i < this.cars.length; i++) {
          this.items.push({label: this.cars[i].accountNumber+'-'+this.cars[i].accountName, value: this.cars[i].accountNumber});
      }
      this.cars = this.items ;
     
    })
  }

  createGenLedFormGroup() {
    const today = new Date().toLocaleDateString('en-GB');
    const issueDatePicker = this.tranFormsDate(today);
    return this.fb.group({
      genLedMethods:this.genLedMethods[0].GenLedId,
      currencyMethod: this.currencyMethod[0].CurrencyId,
      fromDate: issueDatePicker,
      toDate: issueDatePicker,      
      account: this.isSelectedAccount=true,
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
      if (this.genLedForm.value.genLedMethods === 6) {
        const dateFrom = moment([this.genLedForm.value.fromDate.year, this.genLedForm.value.fromDate.month - 1, this.genLedForm.value.fromDate.day]).format(AppConsts.defaultDateFormat);
        // const dateFrom = [this.genLedForm.value.fromDate.year,
        //   this.genLedForm.value.fromDate.month, this.genLedForm.value.fromDate.day].join('/') === '--' ? '' : [this.genLedForm.value.fromDate.year,
        //   this.genLedForm.value.fromDate.month, this.genLedForm.value.fromDate.day].join('/');
        const endFrom = moment([this.genLedForm.value.toDate.year, this.genLedForm.value.toDate.month - 1, this.genLedForm.value.toDate.day]).format(AppConsts.defaultDateFormat);
  
        // const endFrom = [this.genLedForm.value.toDate.year,
        // this.genLedForm.value.toDate.month, this.genLedForm.value.toDate.day].join('/') === '--' ? '' : [this.genLedForm.value.toDate.year,
        // this.genLedForm.value.toDate.month, this.genLedForm.value.toDate.day].join('/');
        this.firstDate = dateFrom;
        this.endDate = endFrom;
      }    
     if(this.genLedForm.value.genLedMethods ===1){
      var date = new Date();
      this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
      this.genLedForm.patchValue({
        fromDate: this.firstDate,
        toDate: this.endDate,
      })
    }
      const genledSearch = {
        startDate: this.firstDate === undefined ? null : this.firstDate,
        endDate: this.endDate === undefined ? null : this.endDate,
        isaccount: this.genLedForm.value.account,
        isAccountReciprocal: this.genLedForm.value.accountReciprocal,
        money: null,
        accNumber: this.genLedForm.value.acountNumberMethod ,      
        case: this.genLedForm.value.genLedMethods
      }
 
      this.activeModal.close(genledSearch);     
    } else {
      this.activeModal.close();
    }
  }
  onChange(e: any) {
    var date = new Date();
    this.case6 = 0;
    switch (this.genLedForm.value.genLedMethods) {
      case 1: {
        this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
        this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        })
        break;
      }
      case 2: {
        var quarter = Math.floor((date.getMonth() / 3));
        var firstDay = new Date(date.getFullYear(), quarter * 3, 1);
        var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
        this.firstDate = firstDay.toLocaleDateString('en-GB');
        this.endDate = lastDay.toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        })
        break;
      }
      case 3: {
        this.firstDate = new Date(date.getFullYear(), 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        })
        break;
      }
      case 4: {
        var quarter = Math.floor((date.getMonth()/ 3));
        var firstDay = new Date(date.getFullYear(), quarter * 3-3,1);
        var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3,0);        
        this.firstDate = firstDay.toLocaleDateString('en-GB');
        this.endDate = lastDay.toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        })
        break;
      }
      case 5: {
        this.firstDate = new Date(date.getFullYear() - 1, 0, 1).toLocaleDateString('en-GB');
        this.endDate = new Date(new Date().getFullYear() - 1, 11, 31).toLocaleDateString('en-GB');
        this.genLedForm.patchValue({
          fromDate: this.firstDate,
          toDate: this.endDate,
        })
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
