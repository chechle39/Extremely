import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  ViewChild,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Observable, Subject, merge, of, Subscription, Observer } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/modules/_shared/services/product.service';
import { ClientSearchModel } from 'app/modules/_shared/models/client/client-search.model';
import { ProductSearchModel } from 'app/modules/_shared/models/product/product-search.model';
import { ItemModel } from 'app/modules/_shared/models/invoice/item.model';
import { ClientService } from 'app/modules/_shared/services/client.service';
import { InvoiceService } from '@modules/_shared/services/invoice.service';
import { AppComponentBase } from '@core/app-base.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from './payment/add-payment/add-payment.component';
import { AppConsts } from '@core/app.consts';
import { PaymentView } from '@modules/_shared/models/invoice/payment-view.model';
import { PaymentService } from '@modules/_shared/services/payment.service';
import { AddTaxComponent } from './add-tax/add-tax.component';
import { InvoiceView } from '@modules/_shared/models/invoice/invoice-view.model';
import * as moment from 'moment';
import { ActionType } from '@core/app.enums';
import { debounceTime, distinctUntilChanged, switchMap, finalize, map, tap, catchError, take, takeUntil } from 'rxjs/operators';
import { TaxService } from '@modules/_shared/services/tax.service';

@Component({
  selector: 'xb-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})

export class CreateInvoiceComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChildren('productName') productNameField: QueryList<any>;
  @ViewChild('amountPaidVC', { static: true }) amountPaidVC: any;
  @ViewChild('xxx', {
    static: true
  }) xxx: ElementRef;
  productInputFocusSub: Subscription = new Subscription();
  listInvoice: any;
  keywords = '';
  loadingIndicator = true;
  productViews: any;
  invoiceNumber = '';
  title = 'New Invoice';
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
  amountPaid = 0;
  amountDue = 0;
  taxsText = '% VAT';
  invoiceId = 0;
  editMode = false;
  viewMode = false;
  focusClient$ = new Subject<string>();
  focusProd$ = new Subject<string>();
  isEditClient = true;
  clientKey = {
    clientKeyword: ''
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
  invoiceList: InvoiceView;
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
  constructor(
    public activeModal: NgbActiveModal,
    injector: Injector,
    private el: ElementRef,
    private clientService: ClientService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private taxService: TaxService,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.createForm();
  }

  ngOnInit() {
    this.getProfiles();
    const request = {
      productKeyword: '',
      isGrid: false
    };

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
    const issueDatePicker = { year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
    this.invoiceForm = this.fb.group({
      invoiceNumber: this.listInvoice === undefined ? ['', [Validators.required]] : [this.listInvoice.invoiceNumber, [Validators.required]],
      invoiceSerial: this.listInvoice === undefined ? ['', [Validators.required]] : [this.listInvoice.invoiceSerial],
      contactName: ['', [Validators.required]],
      clientName: [''],
      clientId: [0],
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
    const formArr = this.invoiceForm.controls.items as FormArray;
    return formArr;
  }
  addNewItem() {
    this.isCheckFc = true;
    const formArray = this.getFormArray();
    formArray.push(this.getItem());
  }
  removeItem(i: number) {
    const saleInvDetailView = [];
    const controls = this.getFormArray();
    if (controls.value[i].productId === undefined) {
      const rs = {
        amount: controls.value[i].amount,
        qty: controls.value[i].qty,
        price: controls.value[i].price,
        description: controls.value[i].description,
        id: controls.value[i].id,
        invoiceId: controls.value[i].invoiceId,
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
      invoiceId: [0],
      id: [0],
      vatAmount: [''],
      taxs: this.fb.array([])
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
          }))
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
          }))
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
      isGrid: false
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
    arrayControl.at(index).get('productId').setValue(this.productSelected.id);
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
    if (isNaN(this.invoiceId)) { return; }

    this.getInvoiceById(this.invoiceId);
  }

  private getInForProfile(request) {
    this.invoiceService.getInfofile(request).subscribe(rp => {
      if (rp.length > 0) {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < rp.length; i++) {
          const file = [
            File = {
              name: rp[i].fileName,
              size: 0,
            } as any
          ];
          this.fileUpload.push(file[0]);
        }
      }
    });
  }

  private getInvoiceById(invoiceId: any) {
    this.invoiceService.getInvoice(invoiceId).subscribe(data => {
      const invoice = data as InvoiceView;
      this.invoiceList = invoice;
      this.invoiceNumber = invoice[0].invoiceNumber;
      this.title = `Invoice ${this.invoiceNumber}`;
      this.clientSelected.id = invoice[0].clientId;
      this.clientSelected.clientName = invoice[0].clientData[0].clientName;
      this.clientSelected.contactName = invoice[0].clientData[0].contactName;
      this.clientSelected.address = invoice[0].clientData[0].address;
      this.clientSelected.taxCode = invoice[0].clientData[0].taxCode;
      this.clientSelected.email = invoice[0].clientData[0].email;

      if (this.viewMode) {
        const request = {
          invoice: this.invoiceNumber,
          seri: invoice[0].invoiceSerial
        };
        this.getInForProfile(request);
        // this.invoiceService.getInfofile(request).subscribe(rp => {
        //   if (rp.length > 0) {
        //     for (let i = 0; i < rp.length; i++) {
        //       const file = [
        //         File = {
        //           name: rp[i].fileName,
        //           size: 0,
        //         } as any
        //       ]
        //       this.fileUpload.push(file[0]);
        //     }
        //   }

        // })
      }

      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();
      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item < invoice[0].saleInvDetailView.length; item++) {
        detailInvoiceFormArray.push(this.getItem());
      }
      this.invoiceForm.patchValue({
        invoiceId: invoice[0].invoiceId,
        invoiceSerial: invoice[0].invoiceSerial,
        invoiceNumber: invoice[0].invoiceNumber,
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
        items: invoice[0].saleInvDetailView,
      });
      this.oldClienName = invoice[0].clientData[0].clientName;
      this.oldClientId = invoice[0].clientData[0].clientId;
      this.subTotalAmount = invoice[0].subTotal;
      this.subTotalDiscountIncl = invoice[0].discount;
      this.totalTaxAmount = invoice[0].vatTax;
      this.paymentViews = invoice[0].paymentView;
      if (invoice[0].issueDate) {
        const issueDate = moment(invoice[0].issueDate).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = { year: Number(issueDateSplit[2]), month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
        this.invoiceForm.controls.issueDate.patchValue(issueDatePicker);
      }
      if (invoice[0].dueDate) {
        const dueDate = moment(invoice[0].dueDate).format(AppConsts.defaultDateFormat);
        const dueDateSplit = dueDate.split('/');
        const dueDatePicker = { year: Number(dueDateSplit[2]), month: Number(dueDateSplit[1]), day: Number(dueDateSplit[0]) };
        this.invoiceForm.controls.dueDate.patchValue(dueDatePicker);
      }
      // this.getAllTax();
      detailInvoiceFormArray.controls.forEach((control, i) => {
        const productId = control.get('productId').value;
        if (invoice[0].saleInvDetailView[i].productId === productId) {
          const vatTax = control.get('vat').value;
          const taxFormsArray = control.get('taxs') as FormArray;
          taxFormsArray.push(this.getTax);
          taxFormsArray.at(0).get('taxRate').setValue(vatTax);
          taxFormsArray.at(0).get('taxName').setValue('VAT');
          taxFormsArray.at(0).get('isChecked').setValue(true);
        }
      });
    });
  }

  cancel() {
    // Resets to blank object
    if (this.editMode) {
      this.router.navigate([`/invoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
      this.viewMode = true;
    } else {
      this.invoiceForm.reset();
      this.router.navigate([`/invoice`]);
    }

  }

  save() {


    if (this.invoiceForm.controls.invoiceSerial.invalid === true || this.invoiceForm.controls.invoiceNumber.invalid === true) {
      this.message.warning('Form invalid');
      return;
    }
    this.viewMode = true;
    if (!this.invoiceForm.valid && this.invoiceId === 0) {
      const a = this.oldClientId === this.invoiceForm.value.clientId;
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
        amountPaid: this.amountPaidData,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        clientId: this.invoiceForm.value.contactName.clientId !== undefined ? this.invoiceForm.value.contactName.clientId : 0,
        clientName: this.invoiceForm.value.clientName === '' ?
          this.invoiceForm.value.contactName.clientName : this.invoiceForm.value.clientName,
        address: this.invoiceForm.value.address === '' ? this.invoiceForm.value.contactName.address : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.taxCode === '' ? this.invoiceForm.value.contactName.taxCode : this.invoiceForm.value.taxCode,
        tag: '',
        contactName:
          this.invoiceForm.value.contactName.contactName !== undefined ?
            this.invoiceForm.value.contactName.contactName : this.xxx.nativeElement.value,
        email: this.invoiceForm.value.email === '' ? '' : this.invoiceForm.value.email,
      };
      const requestInvDt = [];
      this.uploadFileMultiple(request);
      const data = this.invoiceService.CreateSaleInv(request).subscribe((rs: any) => {
        this.invoiceService.getDF().subscribe((x: any) => {
          this.saleInvId = x.invoiceId;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.invoiceForm.value.items.length; i++) {
            const productId = this.invoiceForm.value.items[i].productName.productID;
            const productName = this.invoiceForm.value.items[i].productName.productName;
            const requestInvDetail = {
              id: 0,
              invoiceId: this.saleInvId,
              productId: productId > 0 ? this.invoiceForm.value.items[i].productName.productID : 0,
              productName: productName !== undefined ? this.invoiceForm.value.items[i].productName.productName
                : this.invoiceForm.value.items[i].productName,
              description: this.invoiceForm.value.items[i].description,
              qty: this.invoiceForm.value.items[i].qty,
              price: this.invoiceForm.value.items[i].price,
              amount: this.invoiceForm.value.items[i].amount,
              vat: this.invoiceForm.value.items[i].vat
            };
            requestInvDt.push(requestInvDetail);
          }

          this.invoiceService.CreateSaleInvDetail(requestInvDt).subscribe(xs => {
            this.notify.success('Successfully Add');
            this.router.navigate([`/invoice`]);
          });
        });
      });

      return;
    }
    if (this.invoiceId > 0 && !this.invoiceForm.valid) {
      const checkClientId = this.invoiceForm.value.clientId;
      const saleInvDetailView = [];
      // tslint:disable-next-line:prefer-for-of
      for (let ii = 0; ii < this.invoiceForm.value.items.length; ii++) {
        if (this.invoiceForm.value.items[ii].productId === undefined) {
          const rs = {
            amount: this.invoiceForm.value.items[ii].amount,
            qty: this.invoiceForm.value.items[ii].qty,
            price: this.invoiceForm.value.items[ii].price,
            description: this.invoiceForm.value.items[ii].description,
            id: this.invoiceForm.value.items[ii].id,
            invoiceId: this.invoiceForm.value.invoiceId,
            productId: this.invoiceForm.value.items[ii].productName.productID,
            productName: this.invoiceForm.value.items[ii].productName.productName,
            vat: this.invoiceForm.value.items[ii].vat,
          };
          saleInvDetailView.push(rs);
        }
        if (this.invoiceForm.value.items[ii].productId !== undefined) {
          const object2 = Object.assign({}, this.invoiceForm.value.items[ii],
            {
              invoiceId: this.invoiceForm.value.invoiceId, productId: this.invoiceForm.value.items[ii].productId === ''
                ? 0 : this.invoiceForm.value.items[ii].productId
            });
          saleInvDetailView.push(object2);
        }
      }
      const request1 = {
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
        amountPaid: this.amountPaidVC.inputValue,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        clientId:
          this.invoiceForm.value.contactName !== null ?
            this.invoiceForm.value.contactName.clientId : this.invoiceForm.value.clientId,
        clientName: this.invoiceForm.value.contactName !== null ?
          this.invoiceForm.value.contactName.clientName : this.invoiceForm.value.clientName,
        address: this.invoiceForm.value.contactName !== null ? this.invoiceForm.value.contactName.address : this.invoiceForm.value.address,
        taxCode: this.invoiceForm.value.contactName !== null ? this.invoiceForm.value.contactName.taxCode : this.invoiceForm.value.taxCode,
        tag: this.invoiceForm.value.contactName !== null ? this.invoiceForm.value.contactName.tag : this.invoiceForm.value.tag,
        contactName: this.invoiceForm.value.contactName !== null ?
          this.invoiceForm.value.contactName.contactName : this.invoiceForm.value.contactName,
        email: this.invoiceForm.value.contactName !== null ? this.invoiceForm.value.contactName.email : this.invoiceForm.value.email,
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
          email: this.invoiceForm.value.contactName !== null ? this.invoiceForm.value.contactName.email : this.invoiceForm.value.email,
          note: this.invoiceForm.value.notes,
        }],
        // tslint:disable-next-line:object-literal-shorthand
        saleInvDetailView: saleInvDetailView,
      };
      const request = {
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
        amountPaid: this.amountPaidVC.inputValue,
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
        saleInvDetailView: saleInvDetailView,
      };
      if (request1.clientId === undefined) {
        this.requestData = request;
      } else if (request1.clientId !== undefined) {
        this.requestData = request1;
      }
      this.uploadFileMultiple(this.requestData);
      this.invoiceService.updateSaleInv(this.requestData).pipe(
        finalize(() => {
        })).subscribe(rs => {
          if (this.requestRemove.length <= 0) {
            this.router.navigate([`/invoice`]);
          }
          if (this.requestRemove.length > 0) {
            this.requestRemove.forEach(element => {
              this.invoiceService.deleteInvoiceDetail(element.id).subscribe(() => {
                // this.notify.success('Successfully Deleted');
                this.getDataForEditMode();
                this.requestRemove = [];
                this.router.navigate([`/invoice`]);
              });
            });
          }
          this.notify.success('Successfully Update');
          this.router.navigate([`/invoice/${this.invoiceForm.value.invoiceId}/${ActionType.View}`]);
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
      this.amountPaid = amountPaid.value;
    }
    this.amountDue = this.totalAmount - amountPaid.value;
  }
  amountPaidChange(value) {
    if (value !== '') {
      this.amountPaidData = value;
      this.amountDue = this.totalAmount - Number(value);
    } else {
      this.amountDue = this.totalAmount;
    }
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
    this.nameFile = this.invoiceForm.controls.invoiceNumber.value + '_' + this.invoiceForm.controls.invoiceSerial.value;
    this.fileUpload.push(files[0]);
    console.log(files);
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
      invoiceNumber: this.invoiceForm.controls.invoiceNumber.value,
      invoiceSerial: this.invoiceForm.controls.invoiceSerial.value
    };
    const request = {
      data: data === null ? requestData : data,
      fileUpload: fileRequest
    };
    if (fileRequest.length > 0) {
      this.invoiceService.uploadFileInvMt(request).subscribe(rp => {
        this.notify.success('Successfully upload');
      });
    }

  }

  public createImgPath = (serverPath: string) => {
    if (this.img === undefined) {
      const requestIMG = {
        imgName: serverPath + '.png'
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
    console.log('show');
    this.isMouseEnter = true;
  }
  addPayment(): void {

    const dialog = this.modalService.open(AddPaymentComponent, AppConsts.modalOptionsSmallSize);
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
      clientId: this.invoiceForm.controls.clientId.value,
      clientName: this.invoiceForm.controls.clientName.value,
      address: this.invoiceForm.controls.address.value,
      taxCode: this.invoiceForm.controls.taxCode.value,
      tag: null,
      contactName: this.invoiceForm.controls.contactName.value,
      email: this.invoiceForm.controls.email.value,
      clientData: [],
      saleInvDetailView: [],
    };
    this.invoiceService.updateSaleInv(request).subscribe(rs => {
      this.getInvoiceById(this.invoiceForm.controls.invoiceId.value);
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
    const dialog = this.modalService.open(AddPaymentComponent, AppConsts.modalOptionsSmallSize);
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
  }
  redirectToEditInvoice() {
    this.invoiceForm.enable();
    this.viewMode = false;
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }

  dowloadFile(fileName) {
    const request = {
      filename: fileName
    };
    this.invoiceService.downLoadFile(request).subscribe(rp => { } );
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
          this.invoiceForm.controls.dueDate.value.day].join('-') === '--' ? '' : [this.invoiceForm.controls.dueDate.value.year,
          this.invoiceForm.controls.dueDate.value.month, this.invoiceForm.controls.dueDate.value.day].join('-') : null,
          email: i === 0 ? this.invoiceForm.controls.email.value : null,
          invoiceId: i === 0 ? this.invoiceForm.controls.invoiceId.value : null,
          invoiceNumber: i === 0 ? this.invoiceForm.controls.invoiceNumber.value : null,
          invoiceSerial: i === 0 ? this.invoiceForm.controls.invoiceSerial.value : null,
          issueDate: i === 0 ? [this.invoiceForm.controls.issueDate.value.year,
          this.invoiceForm.controls.issueDate.value.month,
          this.invoiceForm.controls.issueDate.value.day].join('-') === '--' ? '' : [this.invoiceForm.controls.issueDate.value.year,
          this.invoiceForm.controls.issueDate.value.month, this.invoiceForm.controls.issueDate.value.day].join('-') : null,
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
      const reportName = 'InvoiceReport';
      this.invoiceService.SaleInvoiceSaveDataPrint(this.requestSaveJson).subscribe(rp => {
        this.router.navigate([`/print/${reportName}`]);
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
}
