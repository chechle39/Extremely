import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { EntryBatternService } from '../../_shared/services/entry-pattern.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EntryPatternRequest, TransactionTypeRequest } from '../../_shared/models/Entry-Pattern/entry-pattern.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AccountChartService } from '../../_shared/services/accountchart.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppComponentBase } from '../../../coreapp/app-base.component';

@Component({
  selector: 'xb-entrypattern-modal',
  templateUrl: './entrypattern-modal.component.html',
  styleUrls: ['./entrypattern-modal.component.scss'],
})
export class EntrypatternModalComponent extends AppComponentBase implements OnInit {
  transactionType: any[];
  entryType: any[];
  form: FormGroup;
  model: any[];
  dataAccount: any[];
  accSelected: { accountNumber: any; accountName: string };
  crsAccSelected: { accountNumber: any; accountName: String };
  @ViewChild('transactionTypeSelected', { static: true }) transactionTypeSelected: ElementRef;
  @ViewChild('entryTypeSelected', { static: true }) entryTypeSelected: ElementRef;
  constructor(
    private entryPatternService: EntryBatternService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private accountChartService: AccountChartService,
    private injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.form = this.initForm();
    this.getTransactionTypeData();

    this.getAccoutChart();
  }

  searchData = (text$: Observable<string>) => {

    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term === '' ? this.dataAccount
        : this.dataAccount.filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1
          || v.accountNumber.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ));
  }

  getAccoutChart() {
    const subscription = this.accountChartService.searchAcc().subscribe(rp => {
      this.dataAccount = rp;
    });
    this.safeSubscription(subscription);
  }

  accFormatter(value: any) {
    if (value.accountNumber) {
      const stringData = value.accountNumber + '-' + value.accountName;
      return stringData;
    }
    return value = null;
  }

  onBlurCheckvalue(accNumber: any, crspAccNumber: any, dataAccount: any) {
    if (accNumber.accountNumber === crspAccNumber.accountNumber) {
      this.message.warning('Tk đối ứng không được trùng tài khoản! Vui lòng nhập lại');
      return true;
    }
    return false;
  }

  getTransactionTypeData() {
    const subscription = this.entryPatternService.getTransactionType().subscribe(transactionType => {
      this.transactionType = transactionType;
    });
    this.safeSubscription(subscription);
  }
  getEntryTypeByTransactionType(transactionType) {
    const request = new TransactionTypeRequest();
    request.transactionType = transactionType;
    const subscription = this.entryPatternService.getEntryTypeByTransactionType(request).subscribe(entryType => {
      this.entryType = entryType;
    });
    this.safeSubscription(subscription);
  }

  selectedAcc(item) {
    this.accSelected = {
      accountNumber: item.item.accountNumber,
      accountName: item.item.accountNumber + '-' + item.item.accountName,
    };
  }

  initForm(): FormGroup {
    if (this.model) {
      return this.fb.group({
        entry: this.createEntryForm(),
      });
    }
    return this.fb.group({});
  }

  createEntryForm(): FormArray {
    return this.fb.array(
      this.model.map((item) => {
        this.accSelected = {
          accountNumber: item.accNumber,
          accountName: this.dataAccount.filter(x => x.accountNumber === item.accNumber)[0].accountName,
        };
        this.crsAccSelected = {
          accountNumber: item.crspAccNumber,
          accountName: this.dataAccount
            .filter(x => x.accountNumber === item.crspAccNumber)[0].accountName,
        };
        return this.fb.group({
          patternID: [{ value: item.patternID, disabled: true }, Validators.required],
          transactionType: [{ value: item.transactionType, disabled: true }, Validators.required],
          entryType: [item.entryType, [Validators.required]],
          accNumber: [this.accSelected, [Validators.required]],
          crspAccNumber: [this.crsAccSelected, [Validators.required]],
          note: item.note,
          payType: [{ value: item.payType, disabled: true }, Validators.required],
        });
      },
      ));
  }

  clearForm() {
    if (this.form.controls.entry) {
      this.model = [];
      this.form.removeControl('entry');
    }
  }

  search() {
    setTimeout(() => {
      const searchData = new EntryPatternRequest();
      searchData.transactionType = this.transactionTypeSelected.nativeElement.value;
      searchData.entryType = this.entryTypeSelected.nativeElement.value;
      const subscription = this.entryPatternService.getEntry(searchData).subscribe((data) => {
        this.model = data;
        this.form = this.initForm();
      });
      this.safeSubscription(subscription);
    }, 0);
  }

  onTransactionTypeSelect() {
    this.entryType = [];
    this.getEntryTypeByTransactionType(this.transactionTypeSelected.nativeElement.value);

    this.clearForm();


    const transactionTypeValidate = ['SaleInvoice', 'BuyInvoice'];
    if (transactionTypeValidate.indexOf(this.transactionTypeSelected.nativeElement.value) !== -1) {
      this.search();
    }
  }

  onEntryTypeSelect() {
    setTimeout(() => {
      if (this.entryTypeSelected.nativeElement.value !== '') {
        this.search();
      }
    }, 0);
  }

  close(): void {
    this.activeModal.close();
  }

  applyTax() {
    let disabled = false;
    this.form.getRawValue().entry.forEach(element => {
      if (element.accNumber.accountNumber === element.crspAccNumber.accountNumber) {
        disabled = true;
      }
    });
    // stop here if form is invalid
    if (this.form.invalid || disabled) {
      this.notify.warn('Vui lòng nhập đúng');
      return;
    }
    // tslint:disable-next-line:one-line
    else {
      const addListData = [];

      this.form.getRawValue().entry.forEach(element => {
        const item = element;
        item.accNumber = element.accNumber.accountNumber;
        item.crspAccNumber = element.crspAccNumber.accountNumber;

        addListData.push(item);
      });

      if (addListData.length > 0) {
        this.entryPatternService.updateEntryPartern(addListData).subscribe(rs => {
          this.notify.success('Successfully Update');
          // tslint:disable-next-line:no-shadowed-variable
          // this.onload();
          return;
        }, (er) => {
          // this.message.warning('Key này đã tồn tại! Vui lòng kiểm tra lại!');
        });
      }
    }

  }

}
