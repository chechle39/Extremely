import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  ViewChildren,
  ViewChild,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject, merge, of, Subscription } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../../coreapp/app.consts';
import * as moment from 'moment';
import { ActionType } from '../../../coreapp/app.enums';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataMap, CreateRequest, Datatable } from '../../_shared/models/journalentry/journalentry.model';
import { JournalEntryService } from '../../_shared/services/journal-entry.service';
import { AccountChartService } from '../../_shared/services/accountchart.service';

@Component({
  selector: 'xb-create-journalentries',
  templateUrl: './create-journalentries.component.html',
  styleUrls: ['./create-journalentries.component.scss'],
})

export class CreateJournalEntriesComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChildren('productName') productNameField: QueryList<any>;
  @ViewChild('amountPaidVC', { static: true }) amountPaidVC: any;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  @ViewChild('view',  { static: false }) view: ElementRef;
  productInputFocusSub: Subscription = new Subscription();
  listInvoice: any;
  loadingIndicator = true;
  title = 'New JournalEntries';
  saveText = 'Save';
  clientSelected = new DataMap();
  isRead = true;
  isMouseEnter = false;
  invoiceForm: FormGroup;
  invoiceFormValueChanges$;
  subTotalAmount = 0;
  totalTaxAmount = 0;
  invoiceId = 0;
  editMode = false;
  viewMode = false;
  focusClient$ = new Subject<string>();
  isEditClient = true;
  clientKey = {
    clientKeyword: '',
  };
  requestRemove: any[] = [];
  invoiceList: any;
  isCheckFc: boolean;
  searchFailed = false;
  isCheckDate: boolean;
  dataAccount: any[];
  isCheckdr = false;
  debitTotal: number;
  filteredBrands: Datatable[];
  constructor(
    public activeModal: NgbActiveModal,
    injector: Injector,
    private el: ElementRef,
    private journalEntryService: JournalEntryService,
    private router: Router,
    private accountChartService: AccountChartService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    ) {
    super(injector);
    this.createForm();
  }

  ngOnInit() {
    this.isRead = false;
    this.getAccoutChart();
    this.createForm();
    if (this.invoiceForm !== undefined) {
      this.invoiceFormValueChanges$ = this.invoiceForm.controls.items.valueChanges;
      // subscribe to the stream so listen to changes on units
      this.invoiceFormValueChanges$.subscribe(items => this.updateTotalUnitPrice(items) );
      this.methodEdit_View();
    }

    // this.methodEdit_View();

  }

  getAccoutChart() {
    this.accountChartService.searchAcc().subscribe(rp => {
      this.dataAccount = rp;
    });
  }

  filterBrands(event) {
    this.filteredBrands = [];
    for (let i = 0; i < this.dataAccount.length; i++) {
        const brand =  {
          accountNumber: this.dataAccount[i].accountNumber,
          accountName: this.dataAccount[i].accountName,
        };
        this.filteredBrands.push(brand);
    }
}
  private methodEdit_View() {
    if (this.activeRoute !== undefined) {
      this.activeRoute.params.subscribe(params => {
        if (!isNaN(params.id)) {
          this.invoiceId = params.id;
          this.editMode = true;
          this.viewMode = params.key === ActionType.View;
          this.getDataForEditMode();
          if (this.viewMode) {
            this.isRead = true;
            this.invoiceForm.disable();
            this.invoiceForm.controls.items.disable();
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    this.isCheckFc = true;
    this.addEventForInput();
    this.productInputFocusSub = this.productNameField.changes.subscribe(resp => {
      if (this.productNameField.length > 1 && this.isCheckFc !== false) {
        this.productNameField.last.nativeElement.focus();
        this.isCheckFc = false;
      }
    });
  }

  private addEventForInput() {
    const inputList = [].slice.call((this.el.nativeElement as HTMLElement).getElementsByTagName('input'));
    inputList.forEach((input: HTMLElement) => {
      input.addEventListener('focus', () => {
        input.classList.toggle('input-active');
      });
      input.addEventListener('blur', () => {
        input.classList.toggle('input-active');
      });
    });
  }

  createForm() {

    const today = new Date().toLocaleDateString('en-GB');
    const issueDateSplit = today.split('/');
    const issueDatePicker = { year: Number(issueDateSplit[2]),
      month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };

    this.invoiceForm = this.fb.group({
      id: 0,
      objectName: ['', [Validators.required]],
      entryName: ['', [Validators.required]],
      description: [''],
      dateCreate: issueDatePicker,
      objectID: [''],
      objectType: [''],
      items: this.initItems(),
    });
  }
  get issueDate() {
    return this.invoiceForm.get('issueDate');
  }
  initItems() {
    const formArray = this.fb.array([
      // load first row at start
      this.getItem()]);
    return formArray;
  }
  getFormArray() {
    const formArr = this.invoiceForm.controls.items as FormArray;
    return formArr;
  }
  addNewItem() {
    this.isCheckFc = true;
    const formArray = this.getFormArray();
    formArray.push(this.getItem());
  }
  removeItem(i: number) {
    const controls = this.getFormArray();
    if (controls.value[i].id === undefined) {
      const rs = {
        id: controls.value[i].id,
        crspAccNumber: controls.value[i].crspAccNumber,
        accNumber: controls.value[i].accNumber,
        note: controls.value[i].note,
        credit: controls.value[i].credit,
        debit: controls.value[i].debit,
      };
      this.requestRemove.push(rs);
    }
    if (controls.value[i].id !== undefined) {
      this.requestRemove.push(controls.value[i]);
    }
    controls.removeAt(i);
  }

  private getItem() {

    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      id: 0,
      crspAccNumber: [null, [Validators.required]],
      accNumber: [null, [Validators.required]],
      note: [''],
      credit: [0, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(16)]],
      debit: [0, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(16)]],
      // taxs: this.fb.array([])
    });
  }
  searchClient = (text$: Observable<string>) => {
    this.isCheckFc = false;
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term =>
        this.journalEntryService.searchJourMap(this.requestClient(term)).pipe(
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
    this.clientSelected = item.item as DataMap;
    this.isEditClient = false;

  }



  clientFormatter(value: any) {
    if (value.objectName) {
      return value.objectName;
    }
    return value;
  }

  toogleClass(input: HTMLElement) {
    input.classList.toggle('active');
  }

  private getDataForEditMode() {
    if (isNaN(this.invoiceId)) { return; }

    this.getInvoiceById(this.invoiceId);
  }



  private getInvoiceById(invoiceId: any) {
    this.isRead = true;
    this.journalEntryService.getJournalById(invoiceId).subscribe(data => {
      const invoice = data as CreateRequest;
      this.invoiceList = invoice;
      this.title = `JournalEntry ${this.invoiceList.entryName}`;
      this.clientSelected.id = invoice.objectID;

      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();
      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice.detail.length; item++) {
        detailInvoiceFormArray.push(this.getItem());
        detailInvoiceFormArray.at(item).get('note').setValue(invoice.detail[item].note);
        detailInvoiceFormArray.at(item).get('id').setValue(invoice.detail[item].id);
        detailInvoiceFormArray.at(item).get('crspAccNumber').setValue(invoice.detail[item].crspAccNumber);
        detailInvoiceFormArray.at(item).get('accNumber').setValue(invoice.detail[item].accNumber);
        detailInvoiceFormArray.at(item).get('credit').setValue(invoice.detail[item].credit);
        detailInvoiceFormArray.at(item).get('debit').setValue(invoice.detail[item].debit);
      }
      this.invoiceForm.patchValue({
        id: invoice.id,
        objectName: invoice.objectName,
        entryName: invoice.entryName,
        description: invoice.description,
        objectID: invoice.objectID,
        objectType: invoice.objectType,
      });

      if (invoice.dateCreate) {
        const issueDate = moment(invoice.dateCreate).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = { year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]),
          day: Number(issueDateSplit[0]) };
        this.invoiceForm.controls.dateCreate.patchValue(issueDatePicker);
      }
      this.isRead = true;
      this.invoiceForm.controls.items.disable();
    });
    this.isRead = true;
    this.invoiceForm.controls.items.disable();
  }

  cancel() {
    if (this.invoiceId > 0) {
      this.getInvoiceById(this.invoiceId);
      this.isRead = true;
      this.invoiceForm.controls.items.disable();
    }
    if (this.editMode) {
      this.router.navigate([`/pages/journalentries/${this.invoiceForm.value.id}/${ActionType.View}`]);
      this.viewMode = true;
      this.isRead = true;
      this.invoiceForm.disable();
      this.invoiceForm.controls.items.disable();
    } else {
      this.invoiceForm.reset();
      this.router.navigate([`/pages/journalentries`]);
    }

  }

  save() {

    if (this.invoiceForm.controls.objectName.invalid === true
      || this.invoiceForm.controls.entryName.invalid === true
      || this.invoiceForm.controls.description.invalid === true
      || this.invoiceForm.controls.dateCreate.invalid === true) {
      this.message.warning('Form invalid');
      return;
    }
    this.viewMode = true;
    this.isRead = true;
    if (this.invoiceId === 0) {
      const request = {
        id: this.invoiceForm.value.id,
        dateCreate: [this.invoiceForm.value.dateCreate.year,
        this.invoiceForm.value.dateCreate.month, this.invoiceForm.value.dateCreate.day].join('-'),
        description: this.invoiceForm.value.description,
        entryName: this.invoiceForm.value.entryName,
        objectID: this.invoiceForm.value.objectName.id === undefined ? null : this.invoiceForm.value.objectName.id,
        objectName: this.invoiceForm.value.objectName.objectName === undefined ? this.invoiceForm.value.objectName
        : this.invoiceForm.value.objectName.objectName,
        objectType: this.invoiceForm.value.objectName.objectType === undefined
        ? 'Employee' : this.invoiceForm.value.objectName.objectType,
        detail: this.invoiceForm.value.items,
      } as CreateRequest;
      this.journalEntryService.createJournal(request).subscribe(rp => {
        this.notify.success('Successfully Add');
        this.router.navigate([`/pages/journalentries`]);
      });

      return;
    }
    if (this.invoiceId > 0) {
      const request = {
        id: this.invoiceForm.value.id,
        dateCreate: [this.invoiceForm.value.dateCreate.year,
        this.invoiceForm.value.dateCreate.month, this.invoiceForm.value.dateCreate.day].join('-'),
        description: this.invoiceForm.value.description,
        entryName: this.invoiceForm.value.entryName,
        objectID: this.invoiceForm.value.objectID,
        objectName: this.invoiceForm.value.objectName,
        objectType: this.invoiceForm.value.objectType,
        detail: this.invoiceForm.value.items,
      } as CreateRequest;
      this.journalEntryService.updateJournal(request).subscribe(rp => {
        if (this.requestRemove.length > 0) {
          // tslint:disable-next-line:no-shadowed-variable
          const request = [];
          this.requestRemove.forEach(element => {
            const id = element.id;
            request.push({ id });
          });
          this.journalEntryService.journalDelete(request).subscribe(() => {

          });
        }
        this.notify.success('Successfully Update');
        this.router.navigate([`/pages/journalentries/${this.invoiceForm.value.id}/${ActionType.View}`]);
      });
    }

    this.invoiceForm.disable();
  }

  private updateTotalUnitPrice(items: any) {

  }

  totalCredit() {
    let Credit = 0;
    for (let i = 0; i < this.invoiceForm.value.items.length; i ++) {
      const credit = this.invoiceForm.value.items[i].credit === 0 ||
      this.invoiceForm.value.items[i].credit === '0' ||
      this.invoiceForm.value.items[i].credit === null ? 0 :
      this.invoiceForm.value.items[i].credit.toString().replace(/,/g, '');
      const amountDebit = (1 * credit);
      Credit += amountDebit;
    }
    return Credit;
  }
  totalDebit() {
    this.debitTotal = 0;
    for (let i = 0; i < this.invoiceForm.value.items.length; i ++) {
      const debit1 = this.invoiceForm.value.items[i].debit === 0 ||
      this.invoiceForm.value.items[i].debit === '0' ||
      this.invoiceForm.value.items[i].debit === null ? 0 :
      this.invoiceForm.value.items[i].debit.toString().replace(/,/g, '');
      const amountDebit = (1 * debit1);
      this.debitTotal += amountDebit;
    }
    return this.debitTotal;
  }

  redirectToEditInvoice() {
    this.invoiceForm.enable();
    this.viewMode = false;
    this.isRead = false;
  }
}
