import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  Injector,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ClientSearchModel } from '../../_shared/models/client/client-search.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { Subscription, Subject, Observable, merge, of } from 'rxjs';
import { ProductSearchModel } from '../../_shared/models/product/product-search.model';
import { ItemModel } from '../../_shared/models/invoice/item.model';
import { PaymentView } from '../../_shared/models/invoice/payment-view.model';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from './payment/add-payment/add-payment.component';
import { ClientService } from '../../_shared/services/client.service';
import { ProductService } from '../../_shared/services/product.service';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../_shared/services/invoice.service';
import { PaymentService } from '../../_shared/services/payment.service';
import { TaxService } from '../../_shared/services/tax.service';
import { ActionType } from '../../../coreapp/app.enums';
import { debounceTime, distinctUntilChanged, switchMap, catchError, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AppConsts } from '../../../coreapp/app.consts';
import { AddTaxComponent } from './add-tax/add-tax.component';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { ngbTypeheadScrollToActiveItem } from '../../../shared/utils/util';
import { CommonService } from '../../../shared/service/common.service';
import { TranslateService } from '@ngx-translate/core';
import { TaxInvoiceService } from '../../_shared/services/taxinvoice.service';
import { TaxInvoiceView } from '../../_shared/models/tax-invoice/tax-invoice-view.model';

@Component({
  selector: 'xb-create-tax-invoice',
  styleUrls: ['./create-tax-invoice.component.scss'],
  templateUrl: './create-tax-invoice.component.html',
})
export class CreateTaxInvoiceComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChildren('productName') productNameField: QueryList<any>;
  @ViewChild('amountPaidVC', { static: true }) amountPaidVC: any;
  @ViewChild('xxx', {
    static: true,
  }) xxx: ElementRef;
  isRead: boolean = true;
  productInputFocusSub: Subscription = new Subscription();
  listInvoice: any;
  keywords = '';
  loadingIndicator = true;
  productViews: any;
  invoiceNumber = '';
  title = '';
  saveText = 'Save';
  clients = new Array<ClientSearchModel>();
  clientSelected = new ClientSearchModel();
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
  taxInvoiceID = 0;
  editMode = false;
  viewMode: boolean;
  coppyMode: boolean;
  focusClient$ = new Subject<string>();
  focusProd$ = new Subject<string>();
  isEditClient = true;
  clientKey = {
    clientKeyword: '',
  };
  Unit: any;
  unit: any;
  productNameUnit: any;
  saleInvId: any;
  oldClienName: any;
  oldClientId: any;
  requestData: any;
  requestRemove: any[] = [];
  taxData: any;
  dataClientList: ClientSearchModel[];
  amountPaidData: any;
  invoiceList: TaxInvoiceView;
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
  EditUpload: boolean;
  oldFileLent: number;
  checkUpload: boolean;
  isCheckHidden: boolean;
  checkIcon: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    injector: Injector,
    private el: ElementRef,
    private clientService: ClientService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private invoiceService: TaxInvoiceService,
    private paymentService: PaymentService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private taxService: TaxService,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.commonService.CheckAssessFunc('Invoice');
  }

  ngOnInit() {
    if (this.router.url === '/pages/taxinvoice/new') {
      this.viewMode = false;
      this.isCheckFcCoppy = true;
    } else {
      this.viewMode = true;
    }
    this.createForm();
    this.isRead = false;
    this.getProfiles();
    this.getLastIv();
  }

  getLastIv() {
    this.removeItem(0);
    this.invoiceService.getLastInvoice().subscribe(response => {
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
          this.taxInvoiceID = this.saleInvId !== undefined ? this.saleInvId : params.id;
          //  this.editMode = params.key === ActionType.Edit;
          this.editMode = true;
          this.viewMode = params.key === ActionType.View;
          this.coppyMode = params.key === ActionType.Coppy;
          if (this.coppyMode === true) {
            this.isRead = false;
          }
          this.getDataForEditMode();
          this.getPayments(this.taxInvoiceID);
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
    return (!this.viewMode && this.clientSelected.clientId > 0);
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
    const issueDatePicker1 = {
      year: Number(issueDateSplit[2]),
      month: Number(issueDateSplit[1]),
      day: Number(issueDateSplit[0]),
    };

    this.invoiceForm = this.fb.group({
      invoiceNumber: this.listInvoice === undefined
        ? ['', [Validators.required]] : [this.listInvoice.invoiceNumber, [Validators.required]],
      invoiceSerial: this.listInvoice === undefined ? [''] : [this.listInvoice.invoiceSerial],
      contactName: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      clientId: [0],
      address: [''],
      taxCode: [''],
      email: [''],
      yourCompanyName: [this.companyName, [Validators.required]],
      yourCompanyAddress: [this.companyAddress, [Validators.required]],
      yourCompanyId: [this.yourCompanyId, [Validators.required]],
      yourTaxCode: [this.taxCode, [Validators.required]],
      yourBankAccount: [this.bankAccount, [Validators.required]],
      issueDate: [issueDatePicker],
      dueDate: issueDatePicker1,
      reference: [''],
      totalDiscount: [''],
      amountPaid: [''],
      notes: [''],
      termCondition: [''],
      items: this.initItems(),
      taxInvoiceID: [0],
      saleInvoiceId: [0],
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
    this.isCheckFcCoppy = true;
    const formArray = this.getFormArray();
    formArray.push(this.getItem());
  }
  removeItem(i: number) {
    const taxSaleInvDetailView = [];
    const controls = this.getFormArray();
    if (controls.value[i].productId === undefined) {
      const rs = {
        amount: controls.value[i].amount,
        qty: controls.value[i].qty,
        price: controls.value[i].price,
        description: controls.value[i].description,
        id: controls.value[i].id,
        taxInvoiceID: controls.value[i].taxInvoiceID,
        productId: controls.value[i].productName.productID,
        productName: controls.value[i].productName.productName,
        vat: controls.value[i].vat,
      };
      this.requestRemove.push(rs);
    }
    if (controls.value[i].productId !== undefined) {
      this.requestRemove.push(controls.value[i]);
    }
    controls.removeAt(i);
  }

  private getItem() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      productId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(16)]],
      qty: [1, [Validators.required, Validators.pattern(numberPatern), Validators.maxLength(10)]],
      vat: [0],
      amount: [0],
      taxInvoiceID: [0],
      id: [0],
      vatAmount: [''],
      taxs: this.fb.array([]),
    });
  }
  searchClient = (text$: Observable<string>) => {
    this.isCheckFc = false;
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term =>
        this.clientService.searchClient(this.requestClient(term)).pipe(
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
    this.clientSelected = item.item as ClientSearchModel;
    this.isEditClient = false;
    if (this.clientSelected.clientId > 0) {
      this.invoiceForm.controls.clientName.disable();
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
    arrayControl.at(index).get('productId').setValue(this.productSelected.productID);
    const price = this.productSelected.unitPrice;
    arrayControl.at(index).get('price').setValue(Number(price));
  }

  clientFormatter(value: any) {
    if (value.clientName) {
      return value.clientName;
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
    if (isNaN(this.taxInvoiceID)) { return; }

    this.getInvoiceById(this.taxInvoiceID);
  }

  private getInForProfile(request) {
    this.fileUpload = [];
    this.invoiceService.getInfofile(request).subscribe(rp => {
      if (rp !== null) {
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
      }
    });
  }

  private getInvoiceById(taxInvoiceID: any) {
    this.invoiceService.getInvoice(taxInvoiceID).subscribe(data => {
      const invoice = data as TaxInvoiceView;
      this.invoiceList = invoice;
      this.invoiceNumber = this.coppyMode !== true ? invoice[0].invoiceNumber : this.listInvoice.invoiceNumber;
      this.title = this.invoiceNumber;
      this.clientSelected.id = invoice[0].clientId;
      this.clientSelected.clientName = invoice[0].clientData[0].clientName;
      this.clientSelected.contactName = invoice[0].clientData[0].contactName;
      this.clientSelected.address = invoice[0].clientData[0].address;
      this.clientSelected.taxCode = invoice[0].clientData[0].taxCode;
      this.clientSelected.email = invoice[0].clientData[0].email;

      if (this.taxInvoiceID !== 0) {
        const request = {
          invoice: this.invoiceNumber,
          seri: invoice[0].invoiceSerial,
        };
        this.getInForProfile(request);
      }

      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();

      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice[0].taxInvDetailView.length; item++) {
        detailInvoiceFormArray.push(this.getItem());
      }

      this.invoiceForm.patchValue({
        taxInvoiceID: invoice[0].taxInvoiceID,
        saleInvoiceId: invoice[0].saleInvoiceId,
        invoiceSerial: invoice[0].invoiceSerial,
        invoiceNumber: this.coppyMode !== true ? invoice[0].invoiceNumber : this.listInvoice.invoiceNumber,
        clientId: invoice[0].clientData[0].clientId,
        clientName: invoice[0].clientData[0].clientName,
        address: invoice[0].clientData[0].address,
        taxCode: invoice[0].clientData[0].taxCode,
        email: invoice[0].clientData[0].email,
        contactName: invoice[0].clientData[0].contactName,
        reference: invoice[0].reference,
        amountPaid: invoice[0].amountPaid,
        totalDiscount: invoice[0].discRate,
        notes: invoice[0].note,
        termCondition: invoice[0].term,
        items: invoice[0].taxInvDetailView,
      });
      this.oldClienName = invoice[0].clientData[0].clientName;
      this.oldClientId = invoice[0].clientData[0].clientId;
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
        const productId = control.get('productId').value;
        if (invoice[0].taxInvDetailView[i].productId === productId) {
          const vatTax = control.get('vat').value;
          const taxFormsArray = control.get('taxs') as FormArray;
          taxFormsArray.push(this.getTax);
          taxFormsArray.at(0).get('taxRate').setValue(vatTax);
          taxFormsArray.at(0).get('taxName').setValue('VAT');
          taxFormsArray.at(0).get('isChecked').setValue(true);
        }
      });
      if (this.viewMode && this.coppyMode !== true) {
        this.invoiceForm.controls.clientName.disable();
        this.invoiceForm.controls.email.disable();
        this.invoiceForm.controls.address.disable();
        this.invoiceForm.controls.taxCode.disable();
        this.invoiceForm.controls.contactName.disable();
        this.isRead = true;
      }

    });
  }

  countDate(start, end) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(start);
    const secondDate = new Date(end);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
  }
  cancel() {
    this.checkIcon = false;
    if (this.taxInvoiceID > 0) {
      this.getInvoiceById(this.taxInvoiceID);
    }
    this.invoiceForm.controls.contactName.disable();
    this.invoiceForm.controls.clientName.disable();
    this.invoiceForm.controls.email.disable();
    this.invoiceForm.controls.address.disable();
    this.invoiceForm.controls.taxCode.disable();
    // Resets to blank object
    if (this.editMode && this.isRead === false && !this.coppyMode) {
      if (!this.coppyMode) {
        this.router.navigate([`/pages/taxinvoice/${this.invoiceForm.value.taxInvoiceID}/${ActionType.View}`]);
        this.viewMode = true;
        this.isRead = true;
       } else {
        this.router.navigate([`/pages/taxinvoice`]);
       }
      //    this.invoiceForm.disable();
    } else
     if (this.isRead === true && !this.coppyMode || this.coppyMode === undefined) {
       if (!this.viewMode) {
         if (this.invoiceForm.value.taxInvoiceID > 0) {
          this.router.navigate([`/pages/taxinvoice/${this.invoiceForm.value.taxInvoiceID}/${ActionType.View}`]);
          this.viewMode = true;
          this.isRead = true;
         } else {
          this.router.navigate([`/pages/taxinvoice`]);
         }
        this.viewMode = true;
        this.isRead = true;
       } else {
        this.router.navigate([`/pages/taxinvoice`]);
       }
    } else if (this.coppyMode !== true) {
      this.router.navigate([`/pages/taxinvoice`]);
    } else {
      this.invoiceForm.reset();
      this.router.navigate([`/pages/taxinvoice`]);
    }
  }

  save() {
    this.checkUpload = true;
    if (this.invoiceForm.controls.invoiceSerial.invalid === true
      || this.invoiceForm.controls.invoiceNumber.invalid === true
      || this.invoiceForm.controls.issueDate.invalid === true
      || this.invoiceForm.controls.clientName.invalid === true
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
    if (!this.invoiceForm.valid && this.taxInvoiceID === 0 || this.coppyMode === true) {

      const requestInvDt = [];
      for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
        const productID = this.invoiceForm.value.items[i].productName.productName !== undefined
          ? this.invoiceForm.value.items[i].productName.productID
          : this.invoiceForm.value.items[i].productId;
        const productName = this.invoiceForm.value.items[i].productName !== undefined
          ? this.invoiceForm.value.items[i].productName : this.invoiceForm.value.items[i].productName.productName;
        const requestInvDetail = {
          id: 0,
          taxInvoiceID: this.saleInvId,
          productId: productID > 0 ? productID : 0,
          productName: productName.productName !== undefined ? productName.productName : productName,
          description: this.invoiceForm.value.items[i].description,
          qty: this.invoiceForm.value.items[i].qty,
          price: this.invoiceForm.value.items[i].price,
          amount: this.invoiceForm.value.items[i].amount,
          vat: this.invoiceForm.value.items[i].vat,
        };
        requestInvDt.push(requestInvDetail);
      }

      const request = {
        taxInvoiceID: 0,
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
        clientId: this.invoiceForm.value.contactName.clientId !== undefined
          ? this.invoiceForm.value.contactName.clientId : this.invoiceForm.value.clientId,
        clientName: this.invoiceForm.value.clientName === undefined
          ?
          this.invoiceForm.value.contactName.clientName : this.invoiceForm.value.clientName,
        address: this.invoiceForm.value.address === undefined
          ? this.invoiceForm.value.contactName.address : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.taxCode === undefined
          ? this.invoiceForm.value.contactName.taxCode : this.invoiceForm.value.taxCode,
        tag: '',
        contactName:
          this.invoiceForm.value.contactName.contactName !== undefined ?
            this.invoiceForm.value.contactName.contactName : this.xxx.nativeElement.value,
        email: this.invoiceForm.value.email === undefined
        ? this.invoiceForm.value.contactName.email : this.invoiceForm.value.email,
        taxInvDetailView: requestInvDt,
      };
      if (request.invoiceSerial === null) {
        request.invoiceSerial  = '';
      }
      if (this.EditUpload !== true) {
        this.uploadFileMultiple(request);
      }
      if (request.clientId === null) {
        request.clientId = 0;
      }
      if (this.coppyMode === true) {
        request.amountPaid = 0;
      }
      const data = this.invoiceService.CreateSaleInv(request).subscribe((rs: any) => {
        this.taxInvoiceID = this.saleInvId;
        if (!this.coppyMode) {
          this.notify.success('Successfully Add');
        } else {
          this.coppyMode = false;
          this.checkIcon = false;
          this.notify.success('Coppy invoice successfully');
        }
        // this.invoiceForm.reset();
         this.viewMode = true;
         this.getInvoiceById(this.taxInvoiceID);

        // this.invoiceService.getDF().subscribe((x: any) => {
        //   this.saleInvId = x.taxInvoiceID;
        //   for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
        //     const productID = this.invoiceForm.value.items[i].productName.productName !== undefined
        //       ? this.invoiceForm.value.items[i].productName.productID
        //       : this.invoiceForm.value.items[i].productId;
        //     const productName = this.invoiceForm.value.items[i].productName !== undefined
        //       ? this.invoiceForm.value.items[i].productName : this.invoiceForm.value.items[i].productName.productName;
        //     const requestInvDetail = {
        //       id: 0,
        //       taxInvoiceID: this.saleInvId,
        //       productId: productID > 0 ? productID : 0,
        //       productName: productName.productName !== undefined ? productName.productName : productName,
        //       description: this.invoiceForm.value.items[i].description,
        //       qty: this.invoiceForm.value.items[i].qty,
        //       price: this.invoiceForm.value.items[i].price,
        //       amount: this.invoiceForm.value.items[i].amount,
        //       vat: this.invoiceForm.value.items[i].vat,
        //     };
        //     requestInvDt.push(requestInvDetail);
        //   }

        //   this.invoiceService.CreateSaleInvDetail(requestInvDt).subscribe(xs => {
        //     this.taxInvoiceID = this.saleInvId;
        //     if (!this.coppyMode) {
        //       this.notify.success('Successfully Add');
        //     } else {
        //       this.coppyMode = false;
        //       this.checkIcon = false;
        //       this.notify.success('Coppy invoice successfully');
        //     }
        //     // this.invoiceForm.reset();
        //      this.viewMode = true;
        //      this.getInvoiceById(this.taxInvoiceID);
        //     //  this.clientSelected.clientId = 0;
        //     //  this.createForm();
        //     //  this.getLastIv();
        //     //  this.deleteClient();
        //   });
        // });
      });
      
      return;
    }
    if (this.taxInvoiceID > 0 && !this.invoiceForm.valid && !this.coppyMode) {
      const checkClientId = this.invoiceForm.value.clientId;
      const taxSaleInvDetailView = [];
      for (let ii = 0; ii < this.invoiceForm.value.items.length; ii++) {
        if (this.invoiceForm.value.items[ii].productName.productName !== undefined) {
          const rs = {
            amount: this.invoiceForm.value.items[ii].amount,
            qty: this.invoiceForm.value.items[ii].qty,
            price: this.invoiceForm.value.items[ii].price,
            description: this.invoiceForm.value.items[ii].description,
            id: this.invoiceForm.value.items[ii].id,
            taxInvoiceID: this.invoiceForm.value.taxInvoiceID,
            productId: this.invoiceForm.value.items[ii].productName.productID,
            productName: this.invoiceForm.value.items[ii].productName.productName,
            vat: this.invoiceForm.value.items[ii].vat,
          };
          taxSaleInvDetailView.push(rs);
        }
        if (this.invoiceForm.value.items[ii].productName.productName === undefined) {
          const object2 = Object.assign({}, this.invoiceForm.value.items[ii],
            {
              taxInvoiceID:
               this.invoiceForm.value.taxInvoiceID, productId: this.invoiceForm.value.items[ii].productId === ''
                ? 0 : this.invoiceForm.value.items[ii].productId,
            });
          taxSaleInvDetailView.push(object2);
        }
      }
      const request1 = {
        taxInvoiceID: this.invoiceForm.value.taxInvoiceID,
        saleInvoiceId: this.invoiceForm.value.saleInvoiceId,
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
        clientId:
          this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.clientId : this.invoiceForm.value.clientId,
        clientName: this.invoiceForm.value.contactName !== null ?
          this.invoiceForm.value.contactName.clientName : this.invoiceForm.value.clientName,
        address: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.address : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.taxCode : this.invoiceForm.value.taxCode,
        tag: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.tag : this.invoiceForm.value.tag,
        contactName: this.invoiceForm.value.contactName !== null ?
          this.invoiceForm.value.contactName.contactName : this.invoiceForm.value.contactName,
        email: this.invoiceForm.value.contactName !== null
          ? this.invoiceForm.value.contactName.email : this.invoiceForm.value.email,
        clientData: [{
          clientId: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.clientId : this.invoiceForm.value.clientId,
          clientName: this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.clientName : this.invoiceForm.value.clientName,
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
        taxSaleInvDetailView: taxSaleInvDetailView,
      };
      const request = {
        taxInvoiceID: this.invoiceForm.value.taxInvoiceID,
        saleInvoiceId: this.invoiceForm.value.saleInvoiceId,
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
        clientId: checkClientId !== null ? this.invoiceForm.value.clientId : 0,
        clientName: this.invoiceForm.value.clientName,
        address: this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.taxCode,
        tag: null,
        contactName: this.invoiceForm.value.contactName,
        email: this.invoiceForm.value.email,
        clientData: [{
          clientId: checkClientId !== null ? this.invoiceForm.value.clientId : 0,
          clientName: this.invoiceForm.value.clientName,
          address: this.invoiceForm.value.address,
          taxCode: this.invoiceForm.value.taxCode,
          tag: null,
          contactName: this.invoiceForm.value.contactName,
          email: this.invoiceForm.value.email,
          note: this.invoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        taxSaleInvDetailView: taxSaleInvDetailView,
      };

      if (request1.clientId === undefined) {
        this.requestData = request;
      } else if (request1.clientId !== undefined) {
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
      this.invoiceService.updateSaleInv(this.requestData).pipe(
        finalize(() => {
        })).subscribe(rs => {
          this.viewMode = true;
          this.checkIcon = false;
          if (this.requestRemove.length <= 0) {
            this.router.navigate([`/pages/taxinvoice/${this.invoiceForm.value.taxInvoiceID}/${ActionType.View}`]);
          }
          if (this.requestRemove.length > 0) {
            if (requestDl.length > 0) {
              this.invoiceService.deleteInvoiceDetail(requestDl).subscribe(() => {
                // this.notify.success('Successfully Deleted');
                this.getDataForEditMode();
                this.requestRemove = [];
                this.router.navigate([`/pages/taxinvoice/${this.invoiceForm.value.taxInvoiceID}/${ActionType.View}`]);
              });
            }
          }
          this.viewMode = true;
          this.isCheckHidden = true;
          this.notify.success('Successfully Update');
          this.router.navigate([`/pages/taxinvoice/${this.invoiceForm.value.taxInvoiceID}/${ActionType.View}`]);
          if (requestDl.length < 1) {
            this.getInvoiceById(this.taxInvoiceID);

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

    this.invoiceService.uploadFile(files).subscribe((rp: any) => {
      this.getProfiles();
    });
  }

  removeFile(item, index) {
    this.fileUpload.splice(index, 1);
    const rs = {
      fileName: item.name,
    };
    this.invoiceService.removeFile(rs).subscribe(rp => { });
  }

  showPreviewUploadFile(files) {
    this.EditUpload = false;
    this.nameFile = this.invoiceForm.controls.invoiceNumber.value + '_' + this.invoiceForm.controls.invoiceSerial.value;
    this.oldFileLent = this.fileUpload.length;
    this.fileUpload.push(files[0]);
    if (this.taxInvoiceID !== 0) {
      this.uploadFileMultiple(null);
    }
  }

  uploadFileMultiple(data) {
    const fileRequest = [];
    // tslint:disable-next-line:prefer-for-of
    // for (let i = 0; i < this.fileUpload.length; i++) {

    //     fileRequest.push(this.fileUpload[i]);

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
      if (fileRequest[0] !== undefined) {
        this.invoiceService.uploadFileInvMt(request).subscribe(rp => {
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

  }

  public createImgPath = (serverPath: string) => {
    if (this.img === undefined) {
      const requestIMG = {
        imgName: serverPath + '.png',
      };
      this.invoiceService.getFile(requestIMG).subscribe(rp => {
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
  private updateSaleInvAmontPaid() {
    const request = {
      taxInvoiceID: this.invoiceForm.controls.taxInvoiceID.value,
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
      clientId: this.invoiceForm.controls.clientId.value,
      clientName: this.invoiceForm.controls.clientName.value,
      address: this.invoiceForm.controls.address.value,
      taxCode: this.invoiceForm.controls.taxCode.value,
      tag: null,
      contactName: this.invoiceForm.controls.contactName.value,
      email: this.invoiceForm.controls.email.value,
      clientData: [],
      taxSaleInvDetailView: [],
    };
    this.invoiceService.updateSaleInv(request).subscribe(rs => {
      this.getInvoiceById(this.invoiceForm.controls.taxInvoiceID.value);
      // this.allAmontById = 0;
    });
  }

  getPayments(taxInvoiceID: number) {
    this.allAmontById = 0;
    this.paymentService.getPaymentIvByid(taxInvoiceID).pipe(
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
    this.getPayments(this.taxInvoiceID);
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
    const dialog = this.modalService.open(AddPaymentComponent, AppConsts.modalOptionsSmallSize);
    dialog.componentInstance.title = 'Edit Payment';
    dialog.componentInstance.id = payment.id || payment[0].id;
    dialog.componentInstance.outstandingAmount = this.amountDue;
    dialog.componentInstance.taxInvoiceID = this.taxInvoiceID;
    dialog.componentInstance.invoiceList = this.invoiceList;
    dialog.result.then(result => {
      if (result) {
        this.getPayments(this.taxInvoiceID);
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
    // this.invoiceForm.controls.clientName.disabled === false;
    this.invoiceForm.enable();
  }
  deleteClient() {
    this.isEditClient = true;
    this.clientSelected = new ClientSearchModel();
    this.invoiceForm.controls.clientId.reset();
    this.invoiceForm.controls.clientName.reset();
    this.invoiceForm.controls.contactName.reset();
    this.invoiceForm.controls.email.reset();
    this.invoiceForm.controls.address.reset();
    this.invoiceForm.controls.taxCode.reset();

    this.invoiceForm.controls.clientName.enable();
    this.invoiceForm.controls.email.enable();
    this.invoiceForm.controls.address.enable();
    this.invoiceForm.controls.taxCode.enable();

    this.clientSelected.id = null;
    this.clientSelected.clientName = null;
    this.clientSelected.contactName = null;
    this.clientSelected.address = null;
    this.clientSelected.taxCode = null;
    this.clientSelected.email = null;
  }
  redirectToEditInvoice() {
    this.checkIcon = (this.viewMode && this.clientSelected.id > 0);
    this.EditUpload = true;
    this.checkUpload = false;
    this.invoiceForm.controls.contactName.enable();
    this.invoiceForm.controls.clientName.enable();
    this.invoiceForm.controls.email.enable();
    this.invoiceForm.controls.address.enable();
    this.invoiceForm.controls.taxCode.enable();
    this.invoiceForm.enable();
    this.viewMode = false;
    this.isCheckHidden = true;
    this.isRead = false;
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }

  dowloadFile(fileName) {
    const request = {
      filename: fileName,
    };
    this.invoiceService.downLoadFile(request).subscribe(rp => { });
  }

  Print() {
    this.calculateTotalAmount();
    if (this.invoiceForm.controls.items.value.length > 0) {
      for (let i = 0; i < this.invoiceForm.controls.items.value.length; i++) {
        const data = {
          address: i === 0 ? this.invoiceForm.controls.address.value : null,
          amountPaid: i === 0 ? this.invoiceForm.controls.amountPaid.value : null,
          clientId: i === 0 ? this.invoiceForm.controls.clientId.value : null,
          clientName: i === 0 ? this.invoiceForm.controls.clientName.value : null,
          contactName: i === 0 ? this.invoiceForm.controls.contactName.value : null,
          dueDate: i === 0 ? [this.invoiceForm.controls.dueDate.value.year,
          this.invoiceForm.controls.dueDate.value.month,
          this.invoiceForm.controls.dueDate.value.day].join('-') === '--' ?
            '' : [this.invoiceForm.controls.dueDate.value.year,
            this.invoiceForm.controls.dueDate.value.month,
            this.invoiceForm.controls.dueDate.value.day].join('-') : null,
          email: i === 0 ? this.invoiceForm.controls.email.value : null,
          taxInvoiceID: i === 0 ? this.invoiceForm.controls.taxInvoiceID.value : null,
          invoiceNumber: i === 0 ? this.invoiceForm.controls.invoiceNumber.value : null,
          invoiceSerial: i === 0 ? this.invoiceForm.controls.invoiceSerial.value : null,
          issueDate: i === 0 ? [this.invoiceForm.controls.issueDate.value.year,
          this.invoiceForm.controls.issueDate.value.month,
          this.invoiceForm.controls.issueDate.value.day].join('-') === '--' ?
            '' : [this.invoiceForm.controls.issueDate.value.year,
            this.invoiceForm.controls.issueDate.value.month,
            this.invoiceForm.controls.issueDate.value.day].join('-') : null,
          amount: this.invoiceForm.controls.items.value[i].amount,
          description: this.invoiceForm.controls.items.value[i].description,
          id: this.invoiceForm.controls.items.value[i].id,
          price: this.invoiceForm.controls.items.value[i].price,
          productId: this.invoiceForm.controls.items.value[i].productId,
          productName: this.invoiceForm.controls.items.value[i].productName,
          qty: this.invoiceForm.controls.items.value[i].qty,
          vat: this.invoiceForm.controls.items.value[i].vat,
          vatAmount: this.invoiceForm.controls.items.value[i].vatAmount,

          unit: this.invoiceForm.controls.items.value[i].productName.split('(').length > 1
            ? this.invoiceForm.controls.items.value[i].productName.split('(')[1].split(')')[0] : null,

          subTotalAmount: this.currencyPipe.transform(this.subTotalAmount, '', ''),
          totalAmount: this.currencyPipe.transform(this.totalAmount, '', ''),
          notes: i === 0 ? this.invoiceForm.controls.notes.value : null,
          reference: i === 0 ? this.invoiceForm.controls.reference.value : null,
          taxCode: i === 0 ? this.invoiceForm.controls.taxCode.value : null,
          termCondition: i === 0 ? this.invoiceForm.controls.termCondition.value : null,
          totalDiscount: i === 0 ? this.invoiceForm.controls.totalDiscount.value : null,
          yourBankAccount: i === 0 ? this.invoiceForm.controls.yourBankAccount.value : null,
          yourCompanyAddress: i === 0 ? this.invoiceForm.controls.yourCompanyAddress.value : null,
          yourCompanyName: i === 0 ? this.invoiceForm.controls.yourCompanyName.value : null,
          yourTaxCode: i === 0 ? this.invoiceForm.controls.yourTaxCode.value : null,
          yourCompanyCode: i === 0 ? this.companyCode : null,
        };
        this.requestSaveJson.push(data);

      }
      const reportName = 'Sales Invoice';
      this.invoiceService.SaleInvoiceSaveDataPrint(this.requestSaveJson).subscribe(rp => {
        this.router.navigate([`/pages//print/${reportName}`]);
      });
    }
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
    const a = new Date(issueDate);
    const b = new Date(dueDate);
    if (a > b) {
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
}
