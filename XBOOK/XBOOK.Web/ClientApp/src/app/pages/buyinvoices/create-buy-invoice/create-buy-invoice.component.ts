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
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  productInputFocusSub: Subscription = new Subscription();
  listInvoice: any;
  keywords = '';
  loadingIndicator = true;
  productViews: any;
  invoiceNumber = '';
  title = 'New Buy Invoice';
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
  buyInvoiceForm: FormGroup;
  buyInvoiceFormValueChanges$;
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
  viewMode = false;
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
  fileUpload: any[] = [];
  requestSaveJson: any = [];
  Unitproduct: any = [];
  nameFile: string;
  searching = false;
  searchFailed = false;
  isCheckDate: boolean;
  isRead: boolean = true;
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
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.createForm();
  }

  ngOnInit() {
    this.isRead = false;
    this.getProfiles();
    this.buyInvoiceService.getLastBuyInvoice().subscribe(response => {
      this.listInvoice = response;
      this.createForm();
      if (this.buyInvoiceForm !== undefined) {
        this.buyInvoiceFormValueChanges$ = this.buyInvoiceForm.controls.items.valueChanges;
        // subscribe to the stream so listen to changes on units
        this.buyInvoiceFormValueChanges$.subscribe(items => this.updateTotalUnitPrice(items));
        this.methodEdit_View();
      }
    });
    // this.methodEdit_View();

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
          this.invoiceId = params.id;
          //  this.editMode = params.key === ActionType.Edit;
          this.editMode = true;
          this.viewMode = params.key === ActionType.View;
          this.getDataForEditMode();
          this.getPayments(this.invoiceId);
          if (this.viewMode) {
            this.buyInvoiceForm.disable();
            this.buyInvoiceForm.controls.items.disable();
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
    this.buyInvoiceForm = this.fb.group({
      invoiceNumber: this.listInvoice === undefined
        ? ['', [Validators.required]]
        : [this.listInvoice.invoiceNumber, [Validators.required]],
      invoiceSerial: this.listInvoice === undefined
        ? ['', [Validators.required]]
        : [this.listInvoice.invoiceSerial],
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
    });
  }

  initItems() {
    const formArray = this.fb.array([
      // load first row at start
      this.getItem()]);
    return formArray;
  }
  getFormArray() {
    const formArr = this.buyInvoiceForm.controls.items as FormArray;
    return formArr;
  }
  addNewItem() {
    this.isCheckFc = true;
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
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus = this.focusProd$;
    return merge(debouncedText$, inputFocus).pipe(
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
      this.buyInvoiceForm.controls.supplierName.disable();
      this.buyInvoiceForm.controls.contactName.disable();
      this.buyInvoiceForm.controls.email.disable();
      this.buyInvoiceForm.controls.address.disable();
      this.buyInvoiceForm.controls.taxCode.disable();
    } else {
      this.buyInvoiceForm.controls.email.reset();
      this.buyInvoiceForm.controls.address.reset();
      this.buyInvoiceForm.controls.taxCode.reset();
    }
  }

  selectedProduct(item, index) {
    this.productSelected = item.item as ProductSearchModel;
    const arrayControl = this.getFormArray();
    arrayControl.at(index).get('description').setValue(this.productSelected.description);
    arrayControl.at(index).get('productName').setValue(this.productSelected.productName);
    arrayControl.at(index).get('productID').setValue(this.productSelected.id);
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
      this.invoiceNumber = invoice[0].invoiceNumber;
      this.title = `Buy Invoice ${this.invoiceNumber}`;
      this.supplierSelected.id = invoice[0].supplierID;
      this.supplierSelected.supplierName = invoice[0].supplierData[0].supplierName;
      this.supplierSelected.contactName = invoice[0].supplierData[0].contactName;
      this.supplierSelected.address = invoice[0].supplierData[0].address;
      this.supplierSelected.taxCode = invoice[0].supplierData[0].taxCode;
      this.supplierSelected.email = invoice[0].supplierData[0].email;

      if (this.viewMode) {
        const request = {
          invoice: this.invoiceNumber,
          seri: invoice[0].invoiceSerial,
        };
        this.getInForProfile(request);
      }

      this.getFormArray().controls.splice(0);
      const detailbuyInvoiceFormArray = this.getFormArray();
      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice[0].buyInvDetailView.length; item++) {
        detailbuyInvoiceFormArray.push(this.getItem());
      }
      this.buyInvoiceForm.patchValue({
        invoiceId: invoice[0].invoiceId,
        invoiceSerial: invoice[0].invoiceSerial,
        invoiceNumber: invoice[0].invoiceNumber,
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
      });
      this.oldClienName = invoice[0].supplierData[0].supplierName;
      this.oldsupplierID = invoice[0].supplierData[0].supplierID;
      this.subTotalAmount = invoice[0].subTotal;
      this.subTotalDiscountIncl = invoice[0].discount;
      this.totalTaxAmount = invoice[0].vatTax;
      this.paymentViews = invoice[0].paymentView;
      if (invoice[0].issueDate) {
        const issueDate = moment(invoice[0].issueDate).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = {
          year: Number(issueDateSplit[2]),
          month: Number(issueDateSplit[1]),
          day: Number(issueDateSplit[0]),
        };
        this.buyInvoiceForm.controls.issueDate.patchValue(issueDatePicker);
      }
      if (invoice[0].dueDate) {
        const dueDate = moment(invoice[0].dueDate).format(AppConsts.defaultDateFormat);
        const dueDateSplit = dueDate.split('/');
        const dueDatePicker = {
          year: Number(dueDateSplit[2]),
          month: Number(dueDateSplit[1]),
          day: Number(dueDateSplit[0]),
        };
        this.buyInvoiceForm.controls.dueDate.patchValue(dueDatePicker);
      }
      // this.getAllTax();
      detailbuyInvoiceFormArray.controls.forEach((control, i) => {
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
    this.buyInvoiceForm.controls.supplierName.disable();
    this.buyInvoiceForm.controls.contactName.disable();
    this.buyInvoiceForm.controls.email.disable();
    this.buyInvoiceForm.controls.address.disable();
    this.buyInvoiceForm.controls.taxCode.disable();
    this.isRead = true;
  }

  cancel() {
    if (this.invoiceId > 0) {
      this.getBuyInvoiceById(this.invoiceId);
    }
    this.buyInvoiceForm.controls.contactName.disable();
    this.buyInvoiceForm.controls.supplierName.disable();
    this.buyInvoiceForm.controls.email.disable();
    this.buyInvoiceForm.controls.address.disable();
    this.buyInvoiceForm.controls.taxCode.disable();
    // Resets to blank object
    if (this.editMode) {
      this.router.navigate([`/pages/buyinvoice/${this.buyInvoiceForm.value.invoiceId}/${ActionType.View}`]);
      this.viewMode = true;
      this.isRead = true;
    } else {
      this.buyInvoiceForm.reset();
      this.router.navigate([`/pages/buyinvoice`]);
    }

  }

  save() {


    if (this.buyInvoiceForm.controls.invoiceSerial.invalid === true
      || this.buyInvoiceForm.controls.invoiceNumber.invalid === true
      || this.buyInvoiceForm.controls.issueDate.invalid === true
      || this.buyInvoiceForm.controls.supplierName.invalid === true
      || this.buyInvoiceForm.controls.contactName.invalid === true
      || this.buyInvoiceForm.controls.dueDate.invalid === true || this.isCheckDate === true) {
      this.message.warning('Form invalid');
      return;
    }
    this.viewMode = true;
    if (!this.buyInvoiceForm.valid && this.invoiceId === 0) {
      const a = this.oldsupplierID === this.buyInvoiceForm.value.supplierID;
      const request = {
        invoiceId: 0,
        invoiceSerial: this.buyInvoiceForm.value.invoiceSerial,
        invoiceNumber: this.buyInvoiceForm.value.invoiceNumber,
        issueDate: [this.buyInvoiceForm.value.issueDate.year,
        this.buyInvoiceForm.value.issueDate.month,
        this.buyInvoiceForm.value.issueDate.day].join('-') === '--' ? '' : [this.buyInvoiceForm.value.issueDate.year,
        this.buyInvoiceForm.value.issueDate.month, this.buyInvoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.buyInvoiceForm.value.dueDate.year,
        this.buyInvoiceForm.value.dueDate.month,
        this.buyInvoiceForm.value.dueDate.day].join('-') === '--' ? '' : [this.buyInvoiceForm.value.dueDate.year,
        this.buyInvoiceForm.value.dueDate.month, this.buyInvoiceForm.value.dueDate.day].join('-'),
        reference: this.buyInvoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.buyInvoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        amountPaid: this.amountPaidData,
        note: this.buyInvoiceForm.value.notes,
        term: this.buyInvoiceForm.value.termCondition,
        status: '',
        supplierID: this.buyInvoiceForm.value.contactName.supplierID !== undefined
          ? this.buyInvoiceForm.value.contactName.supplierID : 0,
        supplierName: this.buyInvoiceForm.value.supplierName === undefined ?
          this.buyInvoiceForm.value.contactName.supplierName : this.buyInvoiceForm.value.supplierName,
        address: this.buyInvoiceForm.value.address === undefined
          ? this.buyInvoiceForm.value.contactName.address
          : this.buyInvoiceForm.value.address,
        taxCode: this.buyInvoiceForm.value.taxCode === undefined
          ? this.buyInvoiceForm.value.contactName.taxCode
          : this.buyInvoiceForm.value.taxCode,
        tag: '',
        contactName:
          this.buyInvoiceForm.value.contactName.contactName !== undefined ?
            this.buyInvoiceForm.value.contactName.contactName : this.xxx.nativeElement.value,
        email: this.buyInvoiceForm.value.email === undefined
          ? this.buyInvoiceForm.value.contactName.email
          : this.buyInvoiceForm.value.email,
      };
      const requestInvDt = [];
      this.uploadFileMultiple(request);
      const data = this.buyInvoiceService.CreateBuyInv(request).subscribe((rs: any) => {
        this.buyInvoiceService.getDF().subscribe((x: any) => {
          this.saleInvId = x.invoiceId;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.buyInvoiceForm.value.items.length; i++) {
            const productID = this.buyInvoiceForm.value.items[i].productName.productID;
            const productName = this.buyInvoiceForm.value.items[i].productName.productName;
            const requestInvDetail = {
              id: 0,
              invoiceId: this.saleInvId,
              productID: productID > 0 ? this.buyInvoiceForm.value.items[i].productName.productID : 0,
              productName: productName !== undefined ? this.buyInvoiceForm.value.items[i].productName.productName
                : this.buyInvoiceForm.value.items[i].productName,
              description: this.buyInvoiceForm.value.items[i].description,
              qty: this.buyInvoiceForm.value.items[i].qty,
              price: this.buyInvoiceForm.value.items[i].price,
              amount: this.buyInvoiceForm.value.items[i].amount,
              vat: this.buyInvoiceForm.value.items[i].vat,
            };
            requestInvDt.push(requestInvDetail);
          }

          this.buyInvoiceService.CreateBuyInvDetail(requestInvDt).subscribe(xs => {
            this.notify.success('Successfully Add');
            this.router.navigate([`/pages/buyinvoice`]);
          }, () => {
            this.notify.error('Error Add');
          });
        });
      }, () => {
        this.notify.error('Error Add');
      });

      return;
    }
    if (this.invoiceId > 0 && !this.buyInvoiceForm.valid) {
      const checksupplierID = this.buyInvoiceForm.value.supplierID;
      const buyInvDetailView = [];
      // tslint:disable-next-line:prefer-for-of
      for (let ii = 0; ii < this.buyInvoiceForm.value.items.length; ii++) {
        if (this.buyInvoiceForm.value.items[ii].productID === undefined) {
          const rs = {
            amount: this.buyInvoiceForm.value.items[ii].amount,
            qty: this.buyInvoiceForm.value.items[ii].qty,
            price: this.buyInvoiceForm.value.items[ii].price,
            description: this.buyInvoiceForm.value.items[ii].description,
            id: this.buyInvoiceForm.value.items[ii].id,
            invoiceId: this.buyInvoiceForm.value.invoiceId,
            productID: this.buyInvoiceForm.value.items[ii].productName.productID,
            productName: this.buyInvoiceForm.value.items[ii].productName.productName,
            vat: this.buyInvoiceForm.value.items[ii].vat,
          };
          buyInvDetailView.push(rs);
        }
        if (this.buyInvoiceForm.value.items[ii].productID !== undefined) {
          const object2 = Object.assign({}, this.buyInvoiceForm.value.items[ii],
            {
              invoiceId: this.buyInvoiceForm.value.invoiceId,
              productID: this.buyInvoiceForm.value.items[ii].productID === ''
                ? 0 : this.buyInvoiceForm.value.items[ii].productID,
            });
          buyInvDetailView.push(object2);
        }
      }
      const request1 = {
        invoiceId: this.buyInvoiceForm.value.invoiceId,
        invoiceSerial: this.buyInvoiceForm.value.invoiceSerial,
        invoiceNumber: this.buyInvoiceForm.value.invoiceNumber,
        issueDate: [this.buyInvoiceForm.value.issueDate.year,
        this.buyInvoiceForm.value.issueDate.month, this.buyInvoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.buyInvoiceForm.value.dueDate.year,
        this.buyInvoiceForm.value.dueDate.month, this.buyInvoiceForm.value.dueDate.day].join('-'),
        reference: this.buyInvoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.buyInvoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        amountPaid: this.amountPaidVC.nativeElement.innerText,
        note: this.buyInvoiceForm.value.notes,
        term: this.buyInvoiceForm.value.termCondition,
        status: '',
        supplierID:
          this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.supplierID : this.buyInvoiceForm.value.supplierID,
        supplierName: this.buyInvoiceForm.value.contactName !== null ?
          this.buyInvoiceForm.value.contactName.supplierName : this.buyInvoiceForm.value.supplierName,
        address: this.buyInvoiceForm.value.contactName !== null
          ? this.buyInvoiceForm.value.contactName.address
          : this.buyInvoiceForm.value.address,
        taxCode: this.buyInvoiceForm.value.contactName !== null
          ? this.buyInvoiceForm.value.contactName.taxCode
          : this.buyInvoiceForm.value.taxCode,
        tag: this.buyInvoiceForm.value.contactName !== null
          ? this.buyInvoiceForm.value.contactName.tag : this.buyInvoiceForm.value.tag,
        contactName: this.buyInvoiceForm.value.contactName !== null
          ?
          this.buyInvoiceForm.value.contactName.contactName
          : this.buyInvoiceForm.value.contactName,
        email: this.buyInvoiceForm.value.contactName !== null
          ? this.buyInvoiceForm.value.contactName.email
          : this.buyInvoiceForm.value.email,
        supplierData: [{
          supplierID: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.supplierID : this.buyInvoiceForm.value.supplierID,
          supplierName: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.supplierName : this.buyInvoiceForm.value.supplierName,
          address: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.address : this.buyInvoiceForm.value.address,
          taxCode: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.taxCode : this.buyInvoiceForm.value.taxCode,
          tag: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.tag : this.buyInvoiceForm.value.tag,
          contactName: this.buyInvoiceForm.value.contactName !== null ?
            this.buyInvoiceForm.value.contactName.contactName :
            this.buyInvoiceForm.value.contactName,
          email: this.buyInvoiceForm.value.contactName !== null
            ? this.buyInvoiceForm.value.contactName.email : this.buyInvoiceForm.value.email,
          note: this.buyInvoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        buyInvDetailView: buyInvDetailView,
      };
      const request = {
        invoiceId: this.buyInvoiceForm.value.invoiceId,
        invoiceSerial: this.buyInvoiceForm.value.invoiceSerial,
        invoiceNumber: this.buyInvoiceForm.value.invoiceNumber,
        issueDate: [this.buyInvoiceForm.value.issueDate.year,
        this.buyInvoiceForm.value.issueDate.month, this.buyInvoiceForm.value.issueDate.day].join('-'),
        dueDate: [this.buyInvoiceForm.value.dueDate.year,
        this.buyInvoiceForm.value.dueDate.month, this.buyInvoiceForm.value.dueDate.day].join('-'),
        reference: this.buyInvoiceForm.value.reference,
        subTotal: this.subTotalAmount,
        discRate: this.buyInvoiceForm.controls.totalDiscount.value,
        discount: this.subTotalDiscountIncl.toString().substring(1),
        vatTax: this.totalTaxAmount,
        // amountPaid: this.amountPaidData === undefined ? this.amountPaidVC.inputValue: this.amountPaidData,
        amountPaid: this.amountPaidVC.nativeElement.innerText,
        note: this.buyInvoiceForm.value.notes,
        term: this.buyInvoiceForm.value.termCondition,
        status: '',
        supplierID: checksupplierID !== null ? this.buyInvoiceForm.value.supplierID : 0,
        supplierName: this.buyInvoiceForm.value.supplierName,
        address: this.buyInvoiceForm.value.address,
        taxCode: this.buyInvoiceForm.value.taxCode,
        tag: null,
        contactName: this.buyInvoiceForm.value.contactName,
        email: this.buyInvoiceForm.value.email,
        supplierData: [{
          supplierID: checksupplierID !== null ? this.buyInvoiceForm.value.supplierID : 0,
          supplierName: this.buyInvoiceForm.value.supplierName,
          address: this.buyInvoiceForm.value.address,
          taxCode: this.buyInvoiceForm.value.taxCode,
          tag: null,
          contactName: this.buyInvoiceForm.value.contactName,
          email: this.buyInvoiceForm.value.email,
          note: this.buyInvoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        buyInvDetailView: buyInvDetailView,
      };
      if (request1.supplierID === undefined) {
        this.requestData = request;
      } else if (request1.supplierID !== undefined) {
        this.requestData = request1;
      }
      this.uploadFileMultiple(this.requestData);
      this.buyInvoiceService.updateBuyInv(this.requestData).pipe(
        finalize(() => {
        })).subscribe(rs => {
          if (this.requestRemove.length <= 0) {
            this.router.navigate([`/buyinvoice`]);
          }
          if (this.requestRemove.length > 0) {
            this.requestRemove.forEach(element => {
              this.buyInvoiceService.deleteBuyInvoiceDetail(element.id).subscribe(() => {
                // this.notify.success('Successfully Deleted');
                this.getDataForEditMode();
                this.requestRemove = [];
                this.router.navigate([`/buyinvoice`]);
              });
            });
          }
          this.notify.success('Successfully Update');
          this.router.navigate([`/buyinvoice/${this.buyInvoiceForm.value.invoiceId}/${ActionType.View}`]);
        });
    }

    this.buyInvoiceForm.disable();
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
    const discount = (this.buyInvoiceForm.controls.totalDiscount as FormControl);
    if (discount.value !== '') {
      this.subTotalDiscountIncl = -(this.subTotalAmount * Number(discount.value) / 100);
    } else {
      this.subTotalDiscountIncl = 0;
    }
    this.totalAmount = this.subTotalAmount + this.totalTaxAmount + this.subTotalDiscountIncl;
    const amountPaid = (this.buyInvoiceForm.controls.amountPaid as FormControl);
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
    this.nameFile = this.buyInvoiceForm.controls.invoiceNumber.value + '_'
      + this.buyInvoiceForm.controls.invoiceSerial.value;
    this.fileUpload.push(files[0]);
  }

  uploadFileMultiple(data) {
    const fileRequest = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.fileUpload.length; i++) {
      if (this.fileUpload[i].size > 0) {
        fileRequest.push(this.fileUpload[i]);
      }
    }
    const requestData = {
      invoiceNumber: this.buyInvoiceForm.controls.invoiceNumber.value,
      invoiceSerial: this.buyInvoiceForm.controls.invoiceSerial.value,
    };
    const request = {
      data: data === null ? requestData : data,
      fileUpload: fileRequest,
    };
    if (fileRequest.length > 0) {
      this.buyInvoiceService.uploadFileInvMt(request).subscribe(rp => {
        this.notify.success('Successfully upload');
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
      invoiceId: this.buyInvoiceForm.controls.invoiceId.value,
      invoiceSerial: this.buyInvoiceForm.controls.invoiceSerial.value,
      invoiceNumber: this.buyInvoiceForm.controls.invoiceNumber.value,
      issueDate: [this.buyInvoiceForm.controls.issueDate.value.year,
      this.buyInvoiceForm.controls.issueDate.value.month,
      this.buyInvoiceForm.controls.issueDate.value.day].join('-') === '--'
        ? '' : [this.buyInvoiceForm.controls.issueDate.value.year,
        this.buyInvoiceForm.controls.issueDate.value.month, this.buyInvoiceForm.controls.issueDate.value.day].join('-'),
      dueDate: [this.buyInvoiceForm.controls.dueDate.value.year,
      this.buyInvoiceForm.controls.dueDate.value.month,
      this.buyInvoiceForm.controls.dueDate.value.day].join('-') === '--'
        ? '' : [this.buyInvoiceForm.controls.dueDate.value.year,
        this.buyInvoiceForm.controls.dueDate.value.month, this.buyInvoiceForm.controls.dueDate.value.day].join('-'),
      reference: this.buyInvoiceForm.controls.reference.value,
      subTotal: this.subTotalAmount,
      discRate: this.buyInvoiceForm.controls.totalDiscount.value,
      discount: this.subTotalDiscountIncl.toString().substring(1),
      vatTax: this.totalTaxAmount,
      amountPaid: this.checkAddPaymentDeleted === true
        ? ((this.buyInvoiceForm.controls.amountPaid.value === null
          ? 0 : this.buyInvoiceForm.controls.amountPaid.value) - this.deletePaymentAmont)
        : (this.checkAddPayment === true) ? (this.buyInvoiceForm.controls.amountPaid.value === null
          ? 0 : this.buyInvoiceForm.controls.amountPaid.value) + this.paymentViews[this.paymentViews.length - 1].amount
          : this.allAmontById,
      note: this.buyInvoiceForm.controls.notes.value,
      term: this.buyInvoiceForm.controls.termCondition.value,
      status: '',
      supplierID: this.buyInvoiceForm.controls.supplierID.value,
      supplierName: this.buyInvoiceForm.controls.supplierName.value,
      address: this.buyInvoiceForm.controls.address.value,
      taxCode: this.buyInvoiceForm.controls.taxCode.value,
      tag: null,
      contactName: this.buyInvoiceForm.controls.contactName.value,
      email: this.buyInvoiceForm.controls.email.value,
      supplierData: [],
      buyInvDetailView: [],
    };
    this.buyInvoiceService.updateBuyInv(request).subscribe(rs => {
      this.getBuyInvoiceById(this.buyInvoiceForm.controls.invoiceId.value);
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
    // this.buyInvoiceForm.controls.supplierName.disabled === false;
    this.buyInvoiceForm.enable();
  }
  deleteClient() {
    this.isEditClient = true;
    this.supplierSelected = new SupplierSearchModel();
    this.buyInvoiceForm.controls.supplierID.reset();
    this.buyInvoiceForm.controls.supplierName.reset();
    this.buyInvoiceForm.controls.contactName.reset();
    this.buyInvoiceForm.controls.email.reset();
    this.buyInvoiceForm.controls.address.reset();
    this.buyInvoiceForm.controls.taxCode.reset();

    this.buyInvoiceForm.controls.supplierName.enable();
    this.buyInvoiceForm.controls.email.enable();
    this.buyInvoiceForm.controls.address.enable();
    this.buyInvoiceForm.controls.taxCode.enable();
    this.supplierSelected.id = null;
    this.supplierSelected.supplierName = null;
    this.supplierSelected.contactName = null;
    this.supplierSelected.address = null;
    this.supplierSelected.taxCode = null;
    this.supplierSelected.email = null;
  }
  redirectToEditInvoice() {
    this.buyInvoiceForm.enable();
    this.viewMode = false;
    this.buyInvoiceForm.controls.contactName.enable();
    this.buyInvoiceForm.controls.supplierName.enable();
    this.buyInvoiceForm.controls.email.enable();
    this.buyInvoiceForm.controls.address.enable();
    this.buyInvoiceForm.controls.taxCode.enable();
    this.isRead = false;
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
    const issueDate = [this.buyInvoiceForm.controls.issueDate.value.year,
    this.buyInvoiceForm.controls.issueDate.value.month,
    this.buyInvoiceForm.controls.issueDate.value.day].join('-') === '--'
      ? '' : [this.buyInvoiceForm.controls.issueDate.value.year,
      this.buyInvoiceForm.controls.issueDate.value.month, this.buyInvoiceForm.controls.issueDate.value.day].join('-');

    const dueDate = [this.buyInvoiceForm.controls.dueDate.value.year,
    this.buyInvoiceForm.controls.dueDate.value.month,
    this.buyInvoiceForm.controls.dueDate.value.day].join('-') === '--'
      ? '' : [this.buyInvoiceForm.controls.dueDate.value.year,
      this.buyInvoiceForm.controls.dueDate.value.month, this.buyInvoiceForm.controls.dueDate.value.day].join('-');
    if (issueDate > dueDate) {
      return this.isCheckDate = true;
    } else {
      return this.isCheckDate = false;
    }
  }
}
