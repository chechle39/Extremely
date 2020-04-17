import { Component, OnInit, Input, Injector, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { CompanyprofileView } from '../../_shared/models/companyprofile/companyprofile-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { MasterParamService } from '../../_shared/services/masterparam.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../shared/service/common.service';
import { AccountChartService } from '../../_shared/services/accountchart.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { JournalEntryService } from '../../_shared/services/journal-entry.service';
import { Subscription, Subject, Observable, merge, of } from 'rxjs';
import { Datatable, CreateRequest, DataMap } from '../../_shared/models/journalentry/journalentry.model';
import { ActionType } from '../../../coreapp/app.enums';
import * as moment from 'moment';
import { AppConsts } from '../../../coreapp/app.consts';
import { ngbTypeheadScrollToActiveItem } from '../../../shared/utils/util';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-update-masterparam',
  templateUrl: './update-masterparam.component.html',
  styleUrls: ['./update-masterparam.component.scss'],
})
export class EditMasterComponent extends AppComponentBase implements OnInit {
  @Input() title;
  @Input() id: number;
  @ViewChildren('productName') productNameField: QueryList<any>;
  @ViewChild('inputtab', { static: true }) inputtab: ElementRef;
  productInputFocusSub: Subscription = new Subscription();

  isRead = true;
  isMouseEnter = false;
  invoiceForm: FormGroup;
  invoiceId = 0;
  editMode = false;
  viewMode = false;
  focusClient$ = new Subject<string>();
  isEditClient = true;
  clientKey = {
    clientKeyword: '',
  };
  accSelected = {
  };
  clientSelected = new DataMap();
  requestRemove: any[] = [];
  invoiceList: any;
  isCheckFc: boolean;
  searchFailed = false;
  isCheckDate: boolean;
  dataAccount: any[];
  isCheckdr = false;
  debitTotal: number;
  filteredBrands: Datatable[];
  indexCount: any;
  crsAccSelected: { accountNumber: any; accountName: string; acc: any; };
  Listtemp: any;
  paramTypeSelected: any;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private el: ElementRef,
    private journalEntryService: JournalEntryService,
    private masterParamService: MasterParamService,
    private translate: TranslateService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private accountChartService: AccountChartService,
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
  ) {
    super(injector);
    this.commonService.CheckAssessFunc('Journal Entries');
    this.createForm();
  }


  typeheadScrollHandler(e) {
    ngbTypeheadScrollToActiveItem(e);
  }
  ngOnInit() {
    this.isRead = false;
    this.createForm();
    this.getAccoutChart();
    this.createForm();
  }
  getAccoutChart() {
    this.accountChartService.searchAcc().subscribe(rp => {
      this.dataAccount = rp;
      this.methodEdit_View();
    });
  }

  filterBrands(event) {
    this.filteredBrands = [];
    for (let i = 0; i < this.dataAccount.length; i++) {
      const brand = {
        accountNumber: this.dataAccount[i].accountNumber,
        accountName: this.dataAccount[i].accountName,
      };
      this.filteredBrands.push(brand);
    }
  }

  getFormArray() {
    const formArr = this.invoiceForm.controls.items as FormArray;
    return formArr;
  }
  private methodEdit_View() {
    this.invoiceId = this.id;
    this.isRead = true;
    this.getDataForEditMode();
    if (this.viewMode) {
      this.isRead = true;
      this.redirectToEditInvoice();
    }
  }
  // tslint:disable-next-line:use-lifecycle-interface
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
  addNewItem() {
    this.accSelected = null;
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
  createForm() {
    const today = new Date().toLocaleDateString('en-GB');
    const issueDateSplit = today.split('/');
    const issueDatePicker = {
      year: Number(issueDateSplit[2]),
      month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]),
    };

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
  initItems() {
    const formArray = this.fb.array([
      // load first row at start
      this.getItem()]);
    return formArray;
  }
  get issueDate() {
    return this.invoiceForm.get('issueDate');
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

  private getItem() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      id: 0,
      crspAccNumber: ['', [Validators.required]],
      accNumber: ['', [Validators.required]],
      note: [''],
      credit: [0, [Validators.pattern(numberPatern), Validators.maxLength(16)]],
      debit: [0, [Validators.pattern(numberPatern), Validators.maxLength(16)]],
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
  private getDataForEditMode() {
    if (isNaN(this.invoiceId)) { return; }

    this.getInvoiceById(this.invoiceId);
  }
  private getInvoiceById(invoiceId: any) {
   // this.invoiceForm.controls.items.disable();
    this.isRead = true;
    this.journalEntryService.getJournalById(invoiceId).subscribe(data => {
      const invoice = data as CreateRequest;
      this.invoiceList = invoice;
      // this.title = 'JournalEntry';
      this.translate.get('JUOURNAL.HEADER.ENTRY')
        .subscribe(text => { this.title = text; });
      this.translate.get('JUOURNAL.HEADER.ENTRY')
        .subscribe(text => { this.title = text; });
      this.clientSelected.id = invoice.objectID;

      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();

      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice.detail.length; item++) {
        this.accSelected = {
          accountNumber: invoice.detail[item].accNumber,
          accountName: this.dataAccount.filter(x => x.accountNumber === invoice.detail[item].accNumber)[0].accountName,
          acc: invoice.detail[item].accNumber,
        };
        this.crsAccSelected = {
          accountNumber: invoice.detail[item].crspAccNumber,
          accountName: this.dataAccount
            .filter(x => x.accountNumber === invoice.detail[item].crspAccNumber)[0].accountName,
          acc: invoice.detail[item].accNumber,
        };
        detailInvoiceFormArray.push(this.getItem());
        detailInvoiceFormArray.at(item).get('note').setValue(invoice.detail[item].note);
        detailInvoiceFormArray.at(item).get('id').setValue(invoice.detail[item].id);
        detailInvoiceFormArray.at(item).get('crspAccNumber').setValue(this.crsAccSelected);
        detailInvoiceFormArray.at(item).get('accNumber').setValue(this.accSelected);
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
        const issueDatePicker = {
          year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]),
          day: Number(issueDateSplit[0]),
        };
        this.invoiceForm.controls.dateCreate.patchValue(issueDatePicker);
      }
      this.isRead = true;
    });
    this.isRead = true;
  }




  cancel() {
    if (this.invoiceId > 0) {
      this.getInvoiceById(this.invoiceId);
      this.isRead = true;
      this.invoiceForm.controls.items.disable();
    }
    if (this.editMode) {
      // this.router.navigate([`/pages/journalentries/${this.invoiceForm.value.id}/${ActionType.View}`]);
      this.viewMode = true;
      this.isRead = true;
      // this.invoiceForm.disable();
      // this.invoiceForm.controls.items.disable();
    } else {
      this.invoiceForm.reset();
      this.router.navigate([`/pages/journalentries`]);
    }

  }
  close(): void {
    this.activeModal.close();
    this.router.navigate([`/pages/journalentries`]);
  }
  save() {

    if (this.invoiceForm.controls.objectName.invalid === true
      || this.invoiceForm.controls.entryName.invalid === true
      || this.invoiceForm.controls.description.invalid === true
      || this.invoiceForm.controls.dateCreate.invalid === true) {
      this.message.warning('Form invalid');
      return;
    }
    const detailData = [];
    for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
      const data = {
        id: this.invoiceForm.value.items[i].id === null ? 0 : this.invoiceForm.value.items[i].id,
        crspAccNumber: this.invoiceForm.value.items[i].crspAccNumber.accountNumber,
        accNumber: this.invoiceForm.value.items[i].accNumber.accountNumber,
        note: this.invoiceForm.value.items[i].note,
        credit: this.invoiceForm.value.items[i].credit === '' ? 0 : this.invoiceForm.value.items[i].credit,
        debit: this.invoiceForm.value.items[i].debit === '' ? 0 : this.invoiceForm.value.items[i].debit,
      };
      detailData.push(data);
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
        detail: detailData,
      } as CreateRequest;
      this.journalEntryService.createJournal(request).subscribe(rp => {
        this.notify.success('Successfully Add');
       // this.router.navigate([`/pages/journalentries`]);
        this.invoiceForm.reset();
        this.viewMode = true;
        this.clientSelected.id = 0;
        this.isRead = false;
        const today = new Date().toLocaleDateString('en-GB');
        const issueDateSplit = today.split('/');
        const issueDatePicker = {
          year: Number(issueDateSplit[2]),
          month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]),
        };
        this.invoiceForm.controls.dateCreate.patchValue(issueDatePicker);
        this.invoiceForm.controls.id.patchValue(0);

        this.getDataForEditMode();
        this.close();
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
        detail: detailData,
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
        // this.router.navigate([`/pages/journalentries/${this.invoiceForm.value.id}/${ActionType.View}`]);
      });
    }

    // this.invoiceForm.disable();
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
  public onFocus(e: Event): void {
    e.stopPropagation();
    setTimeout(() => {
      const inputEvent: Event = new Event('input');
      e.target.dispatchEvent(inputEvent);
    }, 0);
  }
  requestClient(e: any) {
    const clientKey = {
      clientKeyword: e.toLocaleLowerCase(),
    };
    return clientKey;
  }
  selectedAcc(item) {
    this.accSelected = {
      accountNumber: item.item.accountNumber,
      accountName: item.item.accountNumber + '-' + item.item.accountName,
      acc: item.item.accountNumber,
    };
  }
  selectedItem(item) {
    this.clientSelected = item.item as DataMap;
    this.isEditClient = false;

  }
  selectedCrspAcc(item) {
    this.crsAccSelected = {
      accountNumber: item.item.accountNumber,
      accountName: item.item.accountNumber + '-' + item.item.accountName,
      acc: item.item.accountNumber,
    };
  }
  accFormatter(value: any) {
    if (value.accountNumber) {
      const stringData = value.accountNumber + '-' + value.accountName;
      return stringData;
    }
    return value = null;
  }
  toogleClass(input: HTMLElement) {
    input.classList.toggle('active');
  }
  clientFormatter(value: any) {
    if (value.objectName) {
      return value.objectName;
    }
    return value;
  }
  delete(isAdd: string, paramType: string, key: string, name: string, i: number): void {
    if ((key === null || key === undefined) || isAdd === null) {
      const controls = this.getFormArray();
      controls.removeAt(i);
    }
    // tslint:disable-next-line:one-line
    else {
      this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
      })).subscribe(rs => {
        this.Listtemp = rs;
        if (this.Listtemp.length > 1) {
          const request = [{
            nameDelete: name,
            keydelete: key,
            paramTypedelete: paramType,
          }];
          if (key !== null || key !== undefined) {
            this.message.confirm('Do you want to delete?', 'Are you sure ?', () => {
              this.masterParamService.deleteMaster(request).subscribe(rp => {
                this.notify.success('Successfully Deleted');
              });
            });
          }
        }
      });
    }
  }


  totalDebit() {
    this.debitTotal = 0;
    if (this.invoiceForm.value.items !== undefined) {
      for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
        const debit1 = this.invoiceForm.value.items[i].debit === 0 ||
          this.invoiceForm.value.items[i].debit === '0' ||
          this.invoiceForm.value.items[i].debit === null ? 0 :
          this.invoiceForm.value.items[i].debit.toString().replace(/,/g, '');
        const amountDebit = (1 * debit1);
        this.debitTotal += amountDebit;
      }
      return this.debitTotal;
    } else {
      return this.debitTotal;
    }
  }
  redirectToEditInvoice() {
    this.invoiceForm.enable();
    this.viewMode = true;
    this.isRead = false;
  }

  checkDis(e) {
    if (e !== null) {
      const dis = e.toString().replace(/,/g, '');
      const taltal = 1 * dis;
      return taltal;
    }
  }

  totalCredit() {
    let Credit = 0;
    if (this.invoiceForm.value.items !== undefined) {
      for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
        const credit = this.invoiceForm.value.items[i].credit === 0 ||
          this.invoiceForm.value.items[i].credit === '0' ||
          this.invoiceForm.value.items[i].credit === null ? 0 :
          this.invoiceForm.value.items[i].credit.toString().replace(/,/g, '');
        const amountDebit = (1 * credit);
        Credit += amountDebit;
      }
      return Credit;
    } else {
      return Credit;
    }
  }
}
