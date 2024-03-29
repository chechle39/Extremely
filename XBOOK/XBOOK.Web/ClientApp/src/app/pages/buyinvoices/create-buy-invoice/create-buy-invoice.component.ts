import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, Subject, merge, of, Subscription, Observer } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, switchMap, finalize, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { AddTaxComponent } from './add-tax/add-tax.component';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { SupplierSearchModel } from '../../_shared/models/supplier/supplier-search.model';
import { ProductSearchModel } from '../../_shared/models/product/product-search.model';
import { ItemModel } from '../../_shared/models/invoice/item.model';
import { PaymentView } from '../../_shared/models/invoice/payment-view.model';
import { BuyInvoiceView } from '../../_shared/models/invoice/buy-invoice-view.model';
import { SupplierService } from '../../_shared/services/supplier.service';
import { ProductService } from '../../_shared/services/product.service';
import { InvoiceService } from '../../_shared/services/invoice.service';
import { BuyInvoiceService } from '../../_shared/services/buy-invoice.service';
import { Payment2Service } from '../../_shared/services/payment2.service';
import { TaxService } from '../../_shared/services/tax.service';
import { ActionType } from '../../../coreapp/app.enums';
import { AppConsts } from '../../../coreapp/app.consts';
import { AddPayment2Component } from './payment/add-payment/add-payment.component';
import { ngbTypeheadScrollToActiveItem } from '../../../shared/utils/util';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { CommonService } from '../../../shared/service/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'xb-create-buy-invoice',
  templateUrl: './create-buy-invoice.component.html',
  styleUrls: ['./create-buy-invoice.component.scss'],
})

export class CreateBuyInvoiceComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChildren('productName') productNameField: QueryList<any>;
  @ViewChild('amountPaidVC', { static: true }) amountPaidVC: any;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  @ViewChild('t', { static: true }) t: NgbTooltip;
  productInputFocusSub: Subscription = new Subscription();
  listInvoice: any;
  keywords = '';
  loadingIndicator = true;
  productViews: any;
  invoiceNumber = '';
  title = '';
  saveText = 'Save';
  supplierSelected = new SupplierSearchModel();
  productSelected = new ProductSearchModel();
  itemModels: ItemModel[];
  products: any;
  paymentViews: PaymentView[] = [];
  imgURL: any;
  enableInput = false;
  selectedClient: number = null;
  public selectedMaterial: any;
  public enableAddMode = false;
  dateOfIssue: any;
  dueDate: any;
  isMouseEnter = false;
  invoiceForm: FormGroup;
  invoiceFormValueChanges$;
  companyName: string;
  companyAddress: string;
  companyCode: string;
  taxCode: string;
  bankAccount: string;
  yourCompanyId: number;
  subTotalAmount = 0;
  totalTaxAmount = 0;
  subTotalDiscountIncl = 0;
  totalAmount = 0;
  amountPaid: any;
  amountDue = 0;
  taxsText = '% VAT';
  invoiceId = 0;
  editMode = false;
  viewMode: boolean;
  focusClient$ = new Subject<string>();
  focusProd$ = new Subject<string>();
  isEditClient = true;
  clientKey = {
    clientKeyword: '',
  };
  productNameUnit: any;
  saleInvId: any;
  oldClienName: any;
  oldsupplierID: any;
  requestData: any;
  requestRemove: any[] = [];
  taxData: any;
  amountPaidData: any;
  invoiceList: BuyInvoiceView;
  paidAmont: any;
  checkAddPayment: boolean;
  checkAddPaymentDeleted: boolean;
  allAmontById = 0;
  amount: any;
  deletePaymentAmont: any;
  checkEditPayment: boolean;
  img: string | ArrayBuffer;
  isCheckFc: boolean;
  isCheckFcCoppy: boolean;
  fileUpload: any[] = [];
  requestSaveJson: any = [];
  Unitproduct: any = [];
  nameFile: string;
  searching = false;
  searchFailed = false;
  isCheckDate: boolean;
  isRead: boolean = true;
  EditUpload: boolean;
  checkUpload: boolean;
  isCheckHidden: boolean;
  coppyMode: boolean;
  checkIcon: boolean;
  oldInvoiceNumber: string;
  oldTaxInvoiceNumber: string;
  oldCheck: boolean = false;
  isCheckCheckbox: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    injector: Injector,
    private el: ElementRef,
    private supplierService: SupplierService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private buyInvoiceService: BuyInvoiceService,
    private paymentService: Payment2Service,
    private taxService: TaxService,
    public authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private translate: TranslateService,
    private modalService: NgbModal) {
    super(injector);
    this.commonService.CheckAssessFunc('Buy invoice');
    this.createForm();
  }

  ngOnInit() {
    this.isCheckCheckbox = false;
    if (this.router.url === '/pages/buyinvoice/new') {
      this.viewMode = false;
      this.isCheckFcCoppy = true;
    } else {
      this.viewMode = true;
    }
    this.isRead = false;
    this.getProfiles();
    const request = {
      productKeyword: '',
      isGrid: false,
    };
    this.getLastIv();
    // this.methodEdit_View();

  }
  getLastIv() {
    this.removeItem(0);
    this.buyInvoiceService.getLastBuyInvoice().subscribe(response => {
      this.listInvoice = response;
      this.createForm();
      if (this.invoiceForm !== undefined) {
        this.invoiceFormValueChanges$ = this.invoiceForm.controls.items.valueChanges;
        // subscribe to the stream so listen to changes on units
        this.invoiceFormValueChanges$.subscribe(items => this.updateTotalUnitPrice(items));
        this.methodEdit_View();
      }
    });
  }
  getProfiles() {
    this.invoiceService.getInfoProfile().subscribe((rp: any) => {
      this.companyName = rp.companyName;
      this.taxCode = rp.taxCode;
      this.companyAddress = rp.address;
      this.yourCompanyId = rp.Id;
      this.companyCode = rp.code;
      this.bankAccount = rp.bankAccount;
      const request = 'logo';
      this.createImgPath(request);
    });
  }

  private methodEdit_View() {
    if (this.activeRoute !== undefined) {
      this.activeRoute.params.subscribe(params => {
        if (!isNaN(params.id)) {
          this.invoiceId = this.saleInvId !== undefined ? this.saleInvId : params.id;
          //  this.editMode = params.key === ActionType.Edit;
          this.editMode = true;
          this.viewMode = params.key === ActionType.View;
          this.coppyMode = params.key === ActionType.Coppy;
          if (this.coppyMode === true) {
            this.isRead = false;
          }
          this.getDataForEditMode();
          this.getPayments(this.invoiceId);
          if (this.viewMode && this.coppyMode !== true) {
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
  canActionClient(): boolean {
    return (!this.viewMode && this.supplierSelected.supplierID > 0);
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
    const issueDatePicker = {
      year: Number(issueDateSplit[2]),
      month: Number(issueDateSplit[1]),
      day: Number(issueDateSplit[0]),
    };
    this.invoiceForm = this.fb.group({
      invoiceNumber: this.listInvoice === undefined || this.listInvoice.invoiceNumber === null
      ? ['0001', [Validators.required]] : [this.listInvoice.invoiceNumber, [Validators.required]],
      invoiceSerial: this.listInvoice === undefined
        ? ['']
        : [this.listInvoice.invoiceSerial],
      taxInvoiceNumber: [''],
      contactName: ['', [Validators.required]],
      supplierName: ['', [Validators.required]],
      supplierID: [0],
      address: [''],
      taxCode: [''],
      email: [''],
      yourCompanyName: [this.companyName, [Validators.required]],
      yourCompanyAddress: [this.companyAddress, [Validators.required]],
      yourCompanyId: [this.yourCompanyId, [Validators.required]],
      yourTaxCode: [this.taxCode, [Validators.required]],
      yourBankAccount: [this.bankAccount, [Validators.required]],
      issueDate: issueDatePicker,
      dueDate: issueDatePicker,
      reference: [''],
      totalDiscount: [''],
      amountPaid: [''],
      notes: [''],
      termCondition: [''],
      items: this.initItems(),
      invoiceId: [0],
      checked: false,
    });
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
    this.isCheckFcCoppy = true;
    const formArray = this.getFormArray();
    formArray.push(this.getItem());
  }
  removeItem(i: number) {
    const buyInvDetailView = [];
    const controls = this.getFormArray();
    if (controls.value[i].productID === undefined) {
      const rs = {
        amount: controls.value[i].amount,
        qty: controls.value[i].qty,
        price: controls.value[i].price,
        description: controls.value[i].description,
        id: controls.value[i].id,
        invoiceId: controls.value[i].invoiceId,
        productID: controls.value[i].productName.productID,
        productName: controls.value[i].productName.productName,
        vat: controls.value[i].vat,
      };
      this.requestRemove.push(rs);
    }
    if (controls.value[i].productID !== undefined) {
      this.requestRemove.push(controls.value[i]);
    }
    controls.removeAt(i);
  }

  private getItem() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      productID: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(16)]],
      qty: [1, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(10)]],
      vat: [0],
      amount: [0],
      invoiceId: [0],
      id: [0],
      vatAmount: [''],
      taxs: this.fb.array([]),
    });
  }
  searchSupplier = (text$: Observable<string>) => {
    this.isCheckFc = false;
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term =>
        this.supplierService.searchSupplier(this.requestClient(term)).pipe(
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })),
      ));
  }

  searchProduct = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        this.productService.searchProduct(this.requestProduct(term)).pipe(
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

  requestProduct(e: any) {
    const request = {
      productKeyword: e.toLocaleLowerCase(),
      isGrid: false,
    };
    return request;
  }

  selectedItem(item) {
    this.supplierSelected = item.item as SupplierSearchModel;
    this.isEditClient = false;
    if (this.supplierSelected.supplierID > 0) {
      this.invoiceForm.controls.supplierName.disable();
      this.invoiceForm.controls.email.disable();
      this.invoiceForm.controls.address.disable();
      this.invoiceForm.controls.taxCode.disable();
    } else {
      this.invoiceForm.controls.email.reset();
      this.invoiceForm.controls.address.reset();
      this.invoiceForm.controls.taxCode.reset();
    }
  }

  selectedProduct(item, index) {
    this.productSelected = item.item as ProductSearchModel;
    const arrayControl = this.getFormArray();
    arrayControl.at(index).get('description').setValue(this.productSelected.description);
    arrayControl.at(index).get('productName').setValue(this.productSelected.productName);
    arrayControl.at(index).get('productID').setValue(this.productSelected.productID);
    const price = this.productSelected.unitPrice;
    arrayControl.at(index).get('price').setValue(Number(price));
  }

  clientFormatter(value: any) {
    if (value.supplierName) {
      return value.supplierName;
    }
    return value;
  }
  // productFormatter = (x: { productName: string }) => x.productName;
  productFormatter(value: any) {
    if (value.productName) {
      return value.productName;
    }
    return value;
  }
  toogleClass(input: HTMLElement) {
    input.classList.toggle('active');
  }

  private getDataForEditMode() {
    if (isNaN(this.invoiceId)) { return; }

    this.getBuyInvoiceById(this.invoiceId);
  }

  private getInForProfile(request) {
    this.fileUpload = [];
    this.buyInvoiceService.getInfofile(request).subscribe(rp => {
      if (rp.length > 0) {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < rp.length; i++) {
          const file = [
            File = {
              name: rp[i].fileName,
              size: 0,
            } as any,
          ];
          this.fileUpload.push(file[0]);
        }
      }
    });
  }

  private getBuyInvoiceById(invoiceId: any) {
    this.buyInvoiceService.getBuyInvoiceBuyId(invoiceId).subscribe(data => {
      const invoice = data as BuyInvoiceView;
      this.invoiceList = invoice;
      this.invoiceNumber = this.coppyMode !== true ? invoice[0].invoiceNumber : this.listInvoice.invoiceNumber;
      this.title = this.invoiceNumber;
      this.supplierSelected.id = invoice[0].supplierID;
      this.supplierSelected.supplierName = invoice[0].supplierData[0].supplierName;
      this.supplierSelected.contactName = invoice[0].supplierData[0].contactName;
      this.supplierSelected.address = invoice[0].supplierData[0].address;
      this.supplierSelected.taxCode = invoice[0].supplierData[0].taxCode;
      this.supplierSelected.email = invoice[0].supplierData[0].email;

      if (this.invoiceId !== 0) {
        this.fileUpload = [];
        const request = {
          invoice: this.invoiceNumber,
          seri: invoice[0].invoiceSerial,
        };
        this.getInForProfile(request);
      }

      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();
      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice[0].buyInvDetailView.length; item++) {
        detailInvoiceFormArray.push(this.getItem());
      }
      this.oldInvoiceNumber = invoice[0].invoiceNumber;
      this.oldTaxInvoiceNumber = invoice[0].taxInvoiceNumber;
      // this.isCheckCheckbox = invoice[0].check;
      this.invoiceForm.patchValue({
        invoiceId: invoice[0].invoiceId,
        invoiceSerial: invoice[0].invoiceSerial,
        invoiceNumber: this.coppyMode !== true ? invoice[0].invoiceNumber : this.listInvoice.invoiceNumber,
        supplierID: invoice[0].supplierData[0].supplierID,
        supplierName: invoice[0].supplierData[0].supplierName,
        address: invoice[0].supplierData[0].address,
        taxCode: invoice[0].supplierData[0].taxCode,
        email: invoice[0].supplierData[0].email,
        contactName: invoice[0].supplierData[0].contactName,
        reference: invoice[0].reference,
        amountPaid: invoice[0].amountPaid,
        totalDiscount: invoice[0].discRate,
        notes: invoice[0].note,
        termCondition: invoice[0].term,
        items: invoice[0].buyInvDetailView,
        checked: invoice[0].check,
        taxInvoiceNumber:  invoice[0].taxInvoiceNumber,
      });
      this.oldClienName = invoice[0].supplierData[0].supplierName;
      this.oldsupplierID = invoice[0].supplierData[0].supplierID;
      this.subTotalAmount = invoice[0].subTotal;
      this.subTotalDiscountIncl = invoice[0].discount;
      this.totalTaxAmount = invoice[0].vatTax;
      this.paymentViews = invoice[0].paymentView;

      const count = this.countDate(invoice[0].issueDate, invoice[0].dueDate);
      const todayDue = new Date();
      todayDue.setDate(todayDue.getDate() + count);
      const date = todayDue.toLocaleDateString('en-GB');
      const daySplit = date.split('/');
      const idayPicker = {
        year: Number(daySplit[2]),
        month: Number(daySplit[1]),
        day: Number(daySplit[0]),
      };
      const today = new Date().toLocaleDateString('en-GB');
      const issuetodaySplit = today.split('/');
      const issueTodayPicker = {
        year: Number(issuetodaySplit[2]),
        month: Number(issuetodaySplit[1]),
        day: Number(issuetodaySplit[0]),
      };
      if (invoice[0].issueDate) {
        const issueDate = moment(invoice[0].issueDate).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = {
          year: Number(issueDateSplit[2]),
          month: Number(issueDateSplit[1]),
          day: Number(issueDateSplit[0]),
        };
        this.invoiceForm.controls.issueDate.patchValue(this.coppyMode !== true ? issueDatePicker : issueTodayPicker);
      }
      if (invoice[0].dueDate) {
        const dueDate = moment(invoice[0].dueDate).format(AppConsts.defaultDateFormat);
        const dueDateSplit = dueDate.split('/');
        const dueDatePicker = {
          year: Number(dueDateSplit[2]),
          month: Number(dueDateSplit[1]),
          day: Number(dueDateSplit[0]),
        };
        this.invoiceForm.controls.dueDate.patchValue(this.coppyMode !== true ? dueDatePicker : idayPicker);
      }
      // this.getAllTax();
      detailInvoiceFormArray.controls.forEach((control, i) => {
        const productID = control.get('productID').value;
        if (invoice[0].buyInvDetailView[i].productID === productID) {
          const vatTax = control.get('vat').value;
          const taxFormsArray = control.get('taxs') as FormArray;
          taxFormsArray.push(this.getTax);
          taxFormsArray.at(0).get('taxRate').setValue(vatTax);
          taxFormsArray.at(0).get('taxName').setValue('VAT');
          taxFormsArray.at(0).get('isChecked').setValue(true);
        }
      });
    });
    if (this.viewMode && this.coppyMode !== true) {
      this.invoiceForm.controls.supplierName.disable();
      this.invoiceForm.controls.email.disable();
      this.invoiceForm.controls.address.disable();
      this.invoiceForm.controls.taxCode.disable();
      this.invoiceForm.controls.contactName.disable();
      this.isRead = true;
    }
  }

  countDate(start, end) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(start);
    const secondDate = new Date(end);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
  }

  cancel() {
    this.checkIcon = false;
    if (this.invoiceId > 0) {
      this.getBuyInvoiceById(this.invoiceId);
    }
    this.invoiceForm.controls.contactName.disable();
    this.invoiceForm.controls.supplierName.disable();
    this.invoiceForm.controls.email.disable();
    this.invoiceForm.controls.address.disable();
    this.invoiceForm.controls.taxCode.disable();

    if (this.editMode && this.isRead === false && !this.coppyMode) {
      this.router.navigate([`/pages/buyinvoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
      this.viewMode = true;
      this.isRead = true;
      //    this.invoiceForm.disable();
    } else if (this.isRead === false && !this.coppyMode) {
      this.router.navigate([`/pages/buyinvoice`]);
      this.viewMode = true;
      this.isRead = true;
    } else if (this.coppyMode !== true) {
      this.router.navigate([`/pages/buyinvoice`]);
    } else {
      this.invoiceForm.reset();
      this.router.navigate([`/pages/buyinvoice`]);
    }
  }

  save() {
    this.checkUpload = true;

    if (this.invoiceForm.controls.invoiceSerial.invalid === true
      || this.invoiceForm.controls.invoiceNumber.invalid === true
      || this.invoiceForm.controls.issueDate.invalid === true
      || this.invoiceForm.controls.supplierName.invalid === true
      || this.invoiceForm.controls.contactName.invalid === true
      || this.invoiceForm.controls.dueDate.invalid === true || this.isCheckDate === true) {
      this.translate.get('INVOICE.CREATE.VALID')
        .subscribe(text => {
          this.message.warning(text);
        });
      return;
    }
    if (this.invoiceForm.controls.items.value[0].productName === '') {
      this.translate.get('INVOICE.CREATE.PRODUCT.LENGHT')
      .subscribe(text => {
        this.message.warning(text);
      });
      return;
    }
    // this.viewMode = true;
    if (!this.invoiceForm.valid && this.invoiceId === 0 || this.coppyMode === true) {
      const request = {
        invoiceId: 0,
        invoiceSerial: this.invoiceForm.value.invoiceSerial,
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        issueDate: [this.invoiceForm.value.issueDate.year,
        this.invoiceForm.value.issueDate.month,
        this.invoiceForm.value.issueDate.day].join('-') === '--' ? '' : [this.invoiceForm.value.issueDate.year,
        this.invoiceForm.value.issueDate.month, this.invoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.invoiceForm.value.dueDate.year,
        this.invoiceForm.value.dueDate.month,
        this.invoiceForm.value.dueDate.day].join('-') === '--' ? '' : [this.invoiceForm.value.dueDate.year,
        this.invoiceForm.value.dueDate.month, this.invoiceForm.value.dueDate.day].join('-'),
        reference: this.invoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.invoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        amountPaid: this.amountPaidData === undefined ? this.amountPaid : this.amountPaidData,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        supplierID: this.invoiceForm.value.contactName.supplierID !== undefined
          ? this.invoiceForm.value.contactName.supplierID : this.invoiceForm.value.supplierID,
        supplierName: this.invoiceForm.value.supplierName === undefined ?
          this.invoiceForm.value.contactName.supplierName : this.invoiceForm.value.supplierName,
        address: this.invoiceForm.value.address === undefined
          ? this.invoiceForm.value.contactName.address
          : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.taxCode === undefined
          ? this.invoiceForm.value.contactName.taxCode
          : this.invoiceForm.value.taxCode,
        tag: '',
        contactName:
          this.invoiceForm.value.contactName.contactName !== undefined ?
            this.invoiceForm.value.contactName.contactName : this.xxx.nativeElement.value,
        email: this.invoiceForm.value.email === undefined
          ? this.invoiceForm.value.contactName.email
          : this.invoiceForm.value.email,
          check: this.invoiceForm.value.checked,
          taxInvoiceNumber: this.invoiceForm.value.taxInvoiceNumber,
      };
      if (request.invoiceSerial === null) {
        request.invoiceSerial  = 'A1';
      }
      const requestInvDt = [];
      if (this.EditUpload !== true) {
        this.uploadFileMultiple(request);
      }
      if (request.supplierID === null) {
        request.supplierID = 0;
      }
      if (this.coppyMode === true) {
        request.amountPaid = 0;
      }
      const data = this.buyInvoiceService.CreateBuyInv(request).subscribe((rs: any) => {
        this.buyInvoiceService.getDF().subscribe((x: any) => {
          this.saleInvId = x.invoiceId;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
            const productID = this.invoiceForm.value.items[i].productName.productName !== undefined
              ? this.invoiceForm.value.items[i].productName.productID
              : this.invoiceForm.value.items[i].productID;
            const productName = this.invoiceForm.value.items[i].productName.productName;
            const requestInvDetail = {
              id: 0,
              invoiceId: this.saleInvId,
              productID: productID > 0 ? productID : 0,
              productName: productName !== undefined ? this.invoiceForm.value.items[i].productName.productName
                : this.invoiceForm.value.items[i].productName,
              description: this.invoiceForm.value.items[i].description,
              qty: this.invoiceForm.value.items[i].qty,
              price: this.invoiceForm.value.items[i].price,
              amount: this.invoiceForm.value.items[i].amount,
              vat: this.invoiceForm.value.items[i].vat,
            };
            requestInvDt.push(requestInvDetail);
          }
          const requestDetail = {
            buyInvDetailViewModel: requestInvDt,
            check: this.invoiceForm.value.checked,
          };
          this.buyInvoiceService.CreateBuyInvDetail(requestDetail).subscribe(xs => {
            this.invoiceId = this.saleInvId;
            if (!this.coppyMode) {
              this.invoiceForm.reset();
              this.viewMode = false;
              this.supplierSelected.supplierID = 0;
              this.createForm();
              this.getLastIv();
              this.invoiceId = 0;
              this.deleteClient();
              this.notify.success('Successfully Add');
            } else {
              this.viewMode = true;
              this.getBuyInvoiceById(this.invoiceId);
              this.notify.success('Coppy invoice successfully');
            }

          }, () => {
            this.notify.error('Error Add');
          });
        });
      }, () => {
        this.notify.error('Error Add');
      });

      return;
    }
    if (this.invoiceId > 0 && !this.invoiceForm.valid && !this.coppyMode) {
      const checksupplierID = this.invoiceForm.value.supplierID;
      const buyInvDetailView = [];
      // tslint:disable-next-line:prefer-for-of
      for (let ii = 0; ii < this.invoiceForm.value.items.length; ii++) {
        if (this.invoiceForm.value.items[ii].productName.productName !== undefined) {
          const rs = {
            amount: this.invoiceForm.value.items[ii].amount,
            qty: this.invoiceForm.value.items[ii].qty,
            price: this.invoiceForm.value.items[ii].price,
            description: this.invoiceForm.value.items[ii].description,
            id: this.invoiceForm.value.items[ii].id,
            invoiceId: this.invoiceForm.value.invoiceId,
            productID: this.invoiceForm.value.items[ii].productName.productID,
            productName: this.invoiceForm.value.items[ii].productName.productName,
            vat: this.invoiceForm.value.items[ii].vat,
          };
          buyInvDetailView.push(rs);
        }
        if (this.invoiceForm.value.items[ii].productName.productName === undefined) {
          const object2 = Object.assign({}, this.invoiceForm.value.items[ii],
            {
              invoiceId: this.invoiceForm.value.invoiceId, productID: this.invoiceForm.value.items[ii].productID === ''
                ? 0 : this.invoiceForm.value.items[ii].productID,
            });
          buyInvDetailView.push(object2);
        }
      }
      const request1 = {
        oldInvoiceNumber: this.oldInvoiceNumber,
        oldTaxInvoiceNumber: this.oldTaxInvoiceNumber,
        oldCheck: this.oldCheck,
        check: this.invoiceForm.value.checked,
        taxInvoiceNumber: this.invoiceForm.value.taxInvoiceNumber,
        invoiceId: this.invoiceForm.value.invoiceId,
        invoiceSerial: this.invoiceForm.value.invoiceSerial,
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        issueDate: [this.invoiceForm.value.issueDate.year,
        this.invoiceForm.value.issueDate.month, this.invoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.invoiceForm.value.dueDate.year,
        this.invoiceForm.value.dueDate.month, this.invoiceForm.value.dueDate.day].join('-'),
        reference: this.invoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.invoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        amountPaid: this.amountPaidVC.nativeElement.innerText,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        supplierID:
          this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.supplierID : this.invoiceForm.value.supplierID,
        supplierName: this.invoiceForm.value.contactName !== null ?
          this.invoiceForm.value.contactName.supplierName : this.invoiceForm.value.supplierName,
        address: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.address
          : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.taxCode
          : this.invoiceForm.value.taxCode,
        tag: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.tag : this.invoiceForm.value.tag,
        contactName: this.invoiceForm.value.contactName !== null
          ?
          this.invoiceForm.value.contactName.contactName
          : this.invoiceForm.value.contactName,
        email: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.email
          : this.invoiceForm.value.email,
        supplierData: [{
          supplierID: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.supplierID : this.invoiceForm.value.supplierID,
          supplierName: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.supplierName : this.invoiceForm.value.supplierName,
          address: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.address : this.invoiceForm.value.address,
          taxCode: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.taxCode : this.invoiceForm.value.taxCode,
          tag: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.tag : this.invoiceForm.value.tag,
          contactName: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.contactName :
            this.invoiceForm.value.contactName,
          email: this.invoiceForm.value.contactName !== null
            ? this.invoiceForm.value.contactName.email : this.invoiceForm.value.email,
          note: this.invoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        buyInvDetailView: buyInvDetailView,
      };
      const request = {
        oldInvoiceNumber: this.oldInvoiceNumber,
        oldTaxInvoiceNumber: this.oldTaxInvoiceNumber,
        oldCheck: this.oldCheck,
        check: this.invoiceForm.value.checked,
        taxInvoiceNumber: this.invoiceForm.value.taxInvoiceNumber,
        invoiceId: this.invoiceForm.value.invoiceId,
        invoiceSerial: this.invoiceForm.value.invoiceSerial,
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        issueDate: [this.invoiceForm.value.issueDate.year,
        this.invoiceForm.value.issueDate.month, this.invoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.invoiceForm.value.dueDate.year,
        this.invoiceForm.value.dueDate.month, this.invoiceForm.value.dueDate.day].join('-'),
        reference: this.invoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.invoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        // amountPaid: this.amountPaidData === undefined ? this.amountPaidVC.inputValue: this.amountPaidData,
        amountPaid: this.amountPaidVC.nativeElement.innerText,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        supplierID: checksupplierID !== null ? this.invoiceForm.value.supplierID : 0,
        supplierName: this.invoiceForm.value.supplierName,
        address: this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.taxCode,
        tag: null,
        contactName: this.invoiceForm.value.contactName,
        email: this.invoiceForm.value.email,
        supplierData: [{
          supplierID: checksupplierID !== null ? this.invoiceForm.value.supplierID : 0,
          supplierName: this.invoiceForm.value.supplierName,
          address: this.invoiceForm.value.address,
          taxCode: this.invoiceForm.value.taxCode,
          tag: null,
          contactName: this.invoiceForm.value.contactName,
          email: this.invoiceForm.value.email,
          note: this.invoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        buyInvDetailView: buyInvDetailView,
      };
      if (request1.supplierID === undefined) {
        this.requestData = request;
      } else if (request1.supplierID !== undefined) {
        this.requestData = request1;
      }
      if (this.EditUpload !== true) {
        this.uploadFileMultiple(this.requestData);
      }
      const requestDl = [];
      this.requestRemove.forEach(element => {
        if (element.id !== 0) {
          const id = element.id;
          requestDl.push({ id });
        }
      });
      this.buyInvoiceService.updateBuyInv(this.requestData).pipe(
        finalize(() => {
        })).subscribe(rs => {
          if (this.requestRemove.length <= 0) {
            this.router.navigate([`/pages/buyinvoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
          }
          if (this.requestRemove.length > 0) {
            if (requestDl.length > 0) {
              this.buyInvoiceService.deleteBuyInvoiceDetail(requestDl).subscribe(() => {
                // this.notify.success('Successfully Deleted');
                this.getDataForEditMode();
                this.requestRemove = [];
                this.router.navigate([`/pages/buyinvoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
              });
            }

          }
          this.viewMode = true;
          this.isCheckHidden = true;
          this.notify.success('Successfully Update');
          this.router.navigate([`/pages/buyinvoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
          if (requestDl.length < 1) {
            this.getBuyInvoiceById(this.invoiceId);
          }

        });
    }

    this.invoiceForm.disable();
  }

  private updateTotalUnitPrice(items: any) {
    const arrayControl = this.getFormArray();
    // before recount total price need to be reset.
    this.subTotalAmount = 0;
    this.totalTaxAmount = 0;
    // tslint:disable-next-line:forin
    for (const i in items) {

      const price = items[i].price === '0' || items[i].price === null ? 0 : items[i].price.toString().replace(/,/g, '');
      const amount = (items[i].qty * price);
      const tax = items[i].vat;
      // now format amount price with angular currency pipe
      const amountFormatted = this.currencyPipe.transform(amount, 'VND', '', '');
      arrayControl.at(+i).get('amount').setValue(amountFormatted, { onlySelf: true, emitEvent: false });
      this.subTotalAmount += amount;

      const vatAmount = (amount * tax / 100);
      arrayControl.at(+i).get('vatAmount').setValue(this.currencyPipe.transform(vatAmount, 'VND', '', '')
        , { onlySelf: true, emitEvent: false });
      this.totalTaxAmount += vatAmount;

      this.calculateTotalAmount();
    }
  }
  calculateTotalAmount() {
    const discount = (this.invoiceForm.controls.totalDiscount as FormControl);
    if (discount.value !== '') {
      this.subTotalDiscountIncl = -(this.subTotalAmount * Number(discount.value) / 100);
    } else {
      this.subTotalDiscountIncl = 0;
    }
    this.totalAmount = this.subTotalAmount + this.totalTaxAmount + this.subTotalDiscountIncl;
    const amountPaid = (this.invoiceForm.controls.amountPaid as FormControl);
    if (amountPaid.value !== '') {
      this.amountPaid = _.sumBy(this.paymentViews, item => {
        return item.amount;
      });
    }
    this.amountDue = this.totalAmount - this.amountPaid;
  }
  amountPaidChange(value) {
    if (value !== '') {
      this.amountPaidData = value;
      this.amountDue = this.totalAmount - Number(value);
    } else {
      this.amountDue = this.totalAmount;
    }
  }
  public getAmountPaymentTotal() {
    this.amountPaid = _.sumBy(this.paymentViews, item => {
      return item.amount;
    });
  }
  totalDiscountChange() {
    this.calculateTotalAmount();
  }
  public showPreview(files): void {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message.warning('Only images are supported');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.img = reader.result;
    };
    // tslint:disable-next-line:variable-name

    this.buyInvoiceService.uploadFile(files).subscribe((rp: any) => {
      this.getProfiles();
    });
  }

  removeFile(item, index) {
    this.fileUpload.splice(index, 1);
    const rs = {
      fileName: item.name,
    };
    this.buyInvoiceService.removeFile(rs).subscribe(rp => { });
  }

  showPreviewUploadFile(files) {
    this.EditUpload = false;
    this.nameFile = this.invoiceForm.controls.invoiceNumber.value + '_' + this.invoiceForm.controls.invoiceSerial.value;
    this.fileUpload.push(files[0]);
    if (this.invoiceId !== 0) {
      this.uploadFileMultiple(null);
    }
  }

  uploadFileMultiple(data) {
    const fileRequest = [];
    // tslint:disable-next-line:prefer-for-of
    // for (let i = 0; i < this.fileUpload.length; i++) {
    //   if (this.fileUpload[i].size > 0) {
    //     fileRequest.push(this.fileUpload[i]);
    //   }
    // }
    fileRequest.push(this.fileUpload[this.fileUpload.length - 1]);
    const requestData = {
      invoiceNumber: this.invoiceForm.controls.invoiceNumber.value,
      invoiceSerial: this.invoiceForm.controls.invoiceSerial.value,
    };
    const request = {
      data: data === null ? requestData : data,
      fileUpload: fileRequest,
    };
    if (fileRequest.length > 0 && this.checkUpload === true || this.checkUpload === undefined) {
      if (fileRequest[0] !== undefined)
        this.buyInvoiceService.uploadFileInvMt(request).subscribe(rp => {
          if (this.EditUpload === false || this.checkUpload !== true) {
            this.notify.success('Successfully upload');
          }
          this.fileUpload = [];
          const requestx = {
            invoice: this.invoiceNumber,
            seri: this.invoiceForm.controls.invoiceSerial.value,
          };
          this.getInForProfile(requestx);
        });
    }

  }

  public createImgPath = (serverPath: string) => {
    if (this.img === undefined) {
      const requestIMG = {
        imgName: serverPath + '.png',
      };
      this.buyInvoiceService.getFile(requestIMG).subscribe(rp => {
        const a = 'data:image/png;base64,' + rp;
        if (a !== 'data:image/png;base64,') {
          this.imgURL = a;
        } else {
          this.imgURL = this.img;
        }

      });
    } else {
      this.imgURL = this.img;
    }
  }

  show(): void {
    this.isMouseEnter = true;
  }
  addPayment(): void {

    const dialog = this.modalService.open(AddPayment2Component, AppConsts.modalOptionsSmallSize);
    dialog.componentInstance.outstandingAmount = this.amountDue;
    dialog.componentInstance.invoiceId = this.invoiceId;
    dialog.result.then(result => {
      if (result) {
        this.amount = result.amount;
        this.checkAddPayment = true;
        this.getPayments(this.invoiceId);
      }
    });
  }
  private updateSaleInvAmontPaid() {
    const request = {
      invoiceId: this.invoiceForm.controls.invoiceId.value,
      invoiceSerial: this.invoiceForm.controls.invoiceSerial.value,
      invoiceNumber: this.invoiceForm.controls.invoiceNumber.value,
      issueDate: [this.invoiceForm.controls.issueDate.value.year,
      this.invoiceForm.controls.issueDate.value.month,
      this.invoiceForm.controls.issueDate.value.day].join('-') === '--'
        ? '' : [this.invoiceForm.controls.issueDate.value.year,
        this.invoiceForm.controls.issueDate.value.month, this.invoiceForm.controls.issueDate.value.day].join('-'),
      dueDate: [this.invoiceForm.controls.dueDate.value.year,
      this.invoiceForm.controls.dueDate.value.month, this.invoiceForm.controls.dueDate.value.day].join('-') === '--'
        ? '' : [this.invoiceForm.controls.dueDate.value.year,
        this.invoiceForm.controls.dueDate.value.month, this.invoiceForm.controls.dueDate.value.day].join('-'),
      reference: this.invoiceForm.controls.reference.value,
      subTotal: this.subTotalAmount,
      discRate: this.invoiceForm.controls.totalDiscount.value,
      discount: this.subTotalDiscountIncl.toString().substring(1),
      vatTax: this.totalTaxAmount,
      amountPaid: this.checkAddPaymentDeleted === true
        ? ((this.invoiceForm.controls.amountPaid.value === null
          ? 0 : this.invoiceForm.controls.amountPaid.value) - this.deletePaymentAmont)
        : (this.checkAddPayment === true) ? (this.invoiceForm.controls.amountPaid.value === null
          ? 0 : this.invoiceForm.controls.amountPaid.value) + this.paymentViews[this.paymentViews.length - 1].amount
          : this.allAmontById,
      note: this.invoiceForm.controls.notes.value,
      term: this.invoiceForm.controls.termCondition.value,
      status: '',
      supplierID: this.invoiceForm.controls.supplierID.value,
      supplierName: this.invoiceForm.controls.supplierName.value,
      address: this.invoiceForm.controls.address.value,
      taxCode: this.invoiceForm.controls.taxCode.value,
      tag: null,
      contactName: this.invoiceForm.controls.contactName.value,
      email: this.invoiceForm.controls.email.value,
      supplierData: [],
      buyInvDetailView: [],
    };
    this.buyInvoiceService.updateBuyInv(request).subscribe(rs => {
      this.getBuyInvoiceById(this.invoiceForm.controls.invoiceId.value);
      // this.allAmontById = 0;
    });
  }

  getPayments(invoiceId: number) {
    this.allAmontById = 0;
    this.paymentService.getPaymentIvByid(invoiceId).pipe(
      finalize(() => {
      })).subscribe((i: any) => {
        this.paymentViews = i;


        if (this.checkAddPaymentDeleted === true || this.checkAddPayment === true || this.checkEditPayment === true) {
          this.paymentViews.forEach(element => {
            this.allAmontById += element.amount;
          });
          this.updateSaleInvAmontPaid();
          this.checkAddPaymentDeleted = false;
          this.checkAddPayment = false;
          this.checkEditPayment = false;
        }
      });
  }
  deletePayment(payments: any) {
    if (payments.length === 0) { return; }
    this.getPayments(this.invoiceId);
    this.deletePaymentAmont = 0;
    this.message.confirm('Do you want to delete those payment ?', 'Are you sure ?', () => {
      payments.forEach(element => {
        this.deletePaymentAmont += element.amount;
        this.paymentService.deletePayment(element.id).subscribe(() => {
          this.notify.success('Successfully Deleted');
          this.getPayments(element.id);
          this.checkAddPaymentDeleted = true;
        });
      });
    });
  }

  editPayment(payment: any) {
    if (payment === null) { return; }
    const dialog = this.modalService.open(AddPayment2Component, AppConsts.modalOptionsSmallSize);
    dialog.componentInstance.title = 'Edit Payment';
    dialog.componentInstance.id = payment.id || payment[0].id;
    dialog.componentInstance.outstandingAmount = this.amountDue;
    dialog.componentInstance.invoiceId = this.invoiceId;
    dialog.componentInstance.invoiceList = this.invoiceList;
    dialog.result.then(result => {
      if (result) {
        this.getPayments(this.invoiceId);
        this.checkEditPayment = true;
      }
    });
  }
  get getTax(): FormGroup {
    return this.fb.group({
      taxRate: [null],
      taxName: [null],
      isChecked: [null],
    });
  }
  addTaxPopup(item: any, index: number): void {

    if (!this.viewMode) {
      if (item.value.productName === '') {
        this.message.warning('Please select a product');
        return;
      }
      const arrayControl = this.getFormArray();
      const dialog = this.modalService.open(AddTaxComponent, AppConsts.modalOptionsSmallSize);
      let oldTaxs = [];
      this.getAllTax();
      const taxArr = arrayControl.at(index).get('taxs') as AbstractControl;
      if (taxArr.value.length > 0) {
        oldTaxs = taxArr.value.filter(e => {
          return e.isChecked !== null;
        });
      }
      dialog.componentInstance.taxsList = this.taxData;
      dialog.componentInstance.taxsObj = item.value.vat;
      dialog.result.then(result => {
        if (result === false) {
          return;
        }
        if (result.taxs.length > 0) {
          if (result.allLine) {
            arrayControl.controls.forEach((control, i) => {
              this.UpdateTaxLine(result.taxs, control);
            });
          } else {
            this.UpdateTaxLine(result.taxs, arrayControl.at(index));
          }
        }
      });
    }


  }

  getAllTax() {
    this.taxService.getAll().pipe(finalize(() => {
    })).subscribe(rs => {
      this.taxData = rs;
    });
  }
  private UpdateTaxLine(taxs: Array<any>, control: AbstractControl) {
    let sumTax = 0;
    taxs.forEach(element => {
      if (element.isChecked) {
        const taxFormsArray = control.get('taxs') as FormArray;
        taxFormsArray.push(this.getTax);
        sumTax += Number(element.taxRate);
      }
    });
    control.get('vat').patchValue(sumTax);
    control.get('taxs').patchValue(taxs);
  }
  editClient() {
    this.isEditClient = true;
    // tslint:disable-next-line: no-unused-expression
    // this.invoiceForm.controls.supplierName.disabled === false;
    this.invoiceForm.enable();
  }
  deleteClient() {
    this.isEditClient = true;
    this.supplierSelected = new SupplierSearchModel();
    this.invoiceForm.controls.supplierID.reset();
    this.invoiceForm.controls.supplierName.reset();
    this.invoiceForm.controls.contactName.reset();
    this.invoiceForm.controls.email.reset();
    this.invoiceForm.controls.address.reset();
    this.invoiceForm.controls.taxCode.reset();

    this.invoiceForm.controls.supplierName.enable();
    this.invoiceForm.controls.email.enable();
    this.invoiceForm.controls.address.enable();
    this.invoiceForm.controls.taxCode.enable();
    this.supplierSelected.id = null;
    this.supplierSelected.supplierName = null;
    this.supplierSelected.contactName = null;
    this.supplierSelected.address = null;
    this.supplierSelected.taxCode = null;
    this.supplierSelected.email = null;
  }
  redirectToEditInvoice() {
    this.EditUpload = true;
    this.checkUpload = false;
    this.invoiceForm.enable();
    this.viewMode = false;
    this.invoiceForm.controls.contactName.enable();
    this.invoiceForm.controls.supplierName.enable();
    this.invoiceForm.controls.email.enable();
    this.invoiceForm.controls.address.enable();
    this.invoiceForm.controls.taxCode.enable();
    this.isRead = false;
    this.isCheckHidden = true;
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }

  dowloadFile(fileName) {
    const request = {
      filename: fileName,
    };
    this.buyInvoiceService.downLoadFile(request).subscribe(rp => { });
  }

  getName(nameFile) {
    if (this.nameFile !== undefined) {
      if (nameFile.split('_').length > 1) {
        const name = this.nameFile + '_' + nameFile;
        return this.nameFile + '_' + name.split('_')[4];
      } else {
        return this.nameFile + '_' + nameFile;
      }

    } else {
      return nameFile;
    }
  }

  onDateSelection(e) {
    const issueDate = [this.invoiceForm.controls.issueDate.value.year,
    this.invoiceForm.controls.issueDate.value.month,
    this.invoiceForm.controls.issueDate.value.day].join('-') === '--'
      ? '' : [this.invoiceForm.controls.issueDate.value.year,
      this.invoiceForm.controls.issueDate.value.month, this.invoiceForm.controls.issueDate.value.day].join('-');

    const dueDate = [this.invoiceForm.controls.dueDate.value.year,
    this.invoiceForm.controls.dueDate.value.month,
    this.invoiceForm.controls.dueDate.value.day].join('-') === '--'
      ? '' : [this.invoiceForm.controls.dueDate.value.year,
      this.invoiceForm.controls.dueDate.value.month, this.invoiceForm.controls.dueDate.value.day].join('-');
    if (issueDate > dueDate) {
      return this.isCheckDate = true;
    } else {
      return this.isCheckDate = false;
    }
  }
  typeheadScrollHandler(e) {
    ngbTypeheadScrollToActiveItem(e);
  }
  public onFocus(e: Event): void {
    if ((!this.viewMode ) && this.isRead === false) {
      if ( this.isCheckFcCoppy === true) {
        e.stopPropagation();
        setTimeout(() => {
          const inputEvent: Event = new Event('input');
          e.target.dispatchEvent(inputEvent);
        }, 0);
      }
    }
  }

  focusInvoiceNumber() {

    if (!this.viewMode  && this.invoiceForm.controls.taxInvoiceNumber.value === '') {
      this.t.toggle();
      this.isCheckCheckbox = true;
      this.invoiceForm.controls.taxInvoiceNumber.patchValue(this.invoiceForm.controls.invoiceNumber.value);
    }
    if (this.invoiceForm.controls.taxInvoiceNumber.value !== '' && !this.viewMode) {
      this.t.toggle();
      this.isCheckCheckbox = true;
    }
  }
}
