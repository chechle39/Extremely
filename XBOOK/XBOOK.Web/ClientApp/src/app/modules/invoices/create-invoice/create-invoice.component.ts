import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, Injector, Input, ViewChild } from '@angular/core';
import { Observable, Subject, merge, interval } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl } from '@angular/forms';
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
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { debounceTime, distinctUntilChanged, switchMap, finalize, map } from 'rxjs/operators';
import { SaleInvoiceCreateRequest } from '@modules/_shared/models/invoice/sale-invoice-create-request';

@Component({
  selector: 'xb-create-invoice',
  templateUrl: './create-invoice.component.html'
})
export class CreateInvoiceComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('productName', {
    static: true
  }) productNameField: ElementRef;
  invoiceNumber = '';
  title = 'New Invoice';
  saveText = 'Save';
  clients = new Array<ClientSearchModel>();
  clientSelected = new ClientSearchModel();
  productSelected = new ProductSearchModel();
  itemModels: ItemModel[];
  products: ProductSearchModel[] = [];
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
  saleInvId: any;
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
    private fb: FormBuilder,
    private modalService: NgbModal) {
    super(injector);
    this.createForm();

  }
  ngOnInit() {
    // initialize stream on units
    const request = {
      productKeyword: ''
    };
    this.productService.searchProduct(request).subscribe(response => {
      this.products = response;
    });
    this.clientService.searchClient(this.clientKey).subscribe(response => {
      this.clients = response;
    });
    this.invoiceFormValueChanges$ = this.invoiceForm.controls.items.valueChanges;
    // subscribe to the stream so listen to changes on units
    this.invoiceFormValueChanges$.subscribe(items => this.updateTotalUnitPrice(items));
    this.activeRoute.params.subscribe(params => {
      if (!isNaN(params.id)) {
        this.invoiceId = params.id;
        this.editMode = params.key === ActionType.Edit;
        this.viewMode = params.key === ActionType.View;
        this.getDataForEditMode();
        this.getPayments(this.invoiceId);
        if (this.viewMode) {
          this.invoiceForm.disable();
        }
      }
    });
  }
  ngAfterViewInit() {
    this.addEventForInput();
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
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', [Validators.required]],
      invoiceSerial: [''],
      contactName: ['', [Validators.required]],
      clientName: [''],
      address: [''],
      taxCode: [''],
      email: [''],
      yourCompanyName: ['', [Validators.required]],
      yourCompanyAddress: ['', [Validators.required]],
      yourTaxCode: ['', [Validators.required]],
      yourBankAccount: ['', [Validators.required]],
      issueDate: [''],
      dueDate: [''],
      reference: [''],
      totalDiscount: [''],
      amountPaid: [''],
      notes: [''],
      termCondition: [''],
      items: this.initItems()
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
    const formArray = this.getFormArray();
    formArray.push(this.getItem());
    // const inputList = [].slice.call((this.el.nativeElement as HTMLElement).getElementsByClassName('productNameClass'));
    // inputList[formArray.length - 2].nativeElement.addEventListener('focus', (e) => { });
  }
  removeItem(i: number) {
    const controls = this.getFormArray();
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
      vatAmount: [''],
      taxs: this.fb.array([])
    });
  }

  searchClient = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? this.clients
        : this.clients.filter(v => v.contactName.toLowerCase().indexOf(term.toLowerCase()) > -1))
      ));
  }
  // focusProduct(value: any) {
  //   this.focusProd$ = this.focusProd$.next(value);
  // }
  searchProduct = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus = this.focusProd$;
    return merge(debouncedText$).pipe(
      map(term => (term === '' ? this.products
        : this.products.filter(v => v.productName.toLowerCase().indexOf(term.toLowerCase()) > -1))
      ));
  }
  selectedItem(item) {
    this.clientSelected = item.item as ClientSearchModel;
    this.isEditClient = false;
  }
  selectedProduct(item, index) {
    this.productSelected = item.item as ProductSearchModel;
    const arrayControl = this.getFormArray();
    arrayControl.at(index).get('productName').setValue(this.productSelected.productName);
    arrayControl.at(index).get('productId').setValue(this.productSelected.id);
    const price = this.productSelected.unitPrice;
    arrayControl.at(index).get('price').setValue(Number(price));
  }

  clientFormatter(value: any) {
    if (value.contactName) {
      return value.contactName;
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

    this.invoiceService.getInvoice(this.invoiceId).subscribe(data => {
      const invoice = data as InvoiceView;
      this.invoiceNumber = invoice[0].invoiceNumber;
      this.title = `Invoice ${this.invoiceNumber}`;
      this.clientSelected.id = invoice[0].clientId;
      this.clientSelected.clientName = invoice[0].clientData[0].clientName;
      this.clientSelected.contactName =  invoice[0].clientData[0].contactName;
      this.clientSelected.address = invoice[0].clientData[0].address;
      this.clientSelected.taxCode = invoice[0].clientData[0].taxCode;
      this.clientSelected.email = invoice[0].clientData[0].email;
      this.getFormArray().controls.splice(0);
      const detailInvoiceFormArray = this.getFormArray();
      // tslint:disable-next-line:prefer-for-of
      for (let item = 0; item <  invoice[0].saleInvDetailView.length; item++) {
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
        items: invoice[0].saleInvDetailView
      });
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
        const dueDate = moment(invoice[0].issueDate).format(AppConsts.defaultDateFormat);
        const dueDateSplit = dueDate.split('/');
        const dueDatePicker = { year: Number(dueDateSplit[2]), month: Number(dueDateSplit[1]), day: Number(dueDateSplit[0]) };
        this.invoiceForm.controls.dueDate.patchValue(dueDatePicker);
      }
      detailInvoiceFormArray.controls.forEach((control, i) => {
        const productId = control.get('productId').value;
        if (invoice[0].saleInvDetailView[i].productId === productId) {
          const vatTax = control.get('vat').value;
          const taxFormsArray = control.get('taxs') as FormArray;
          taxFormsArray.push(this.getTax);
          taxFormsArray.at(0).get('taxRace').setValue(vatTax);
          taxFormsArray.at(0).get('taxName').setValue('VAT');
          taxFormsArray.at(0).get('isChecked').setValue(true);
        }
      });
    });
  }
  cancel() {
    // Resets to blank object
    this.invoiceForm.reset();
    this.router.navigate([`/invoice`]);
  }
  save() {
    if (!this.invoiceForm.valid && this.invoiceId === 0) {
      const request = {
        invoiceId: 0,
        invoiceSerial: this.invoiceForm.value.invoiceSerial,
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        issueDate: [ this.invoiceForm.value.issueDate.year,
          this.invoiceForm.value.issueDate.month, this.invoiceForm.value.issueDate.day].join('-'),
        dueDate: [ this.invoiceForm.value.dueDate.year,
          this.invoiceForm.value.dueDate.month, this.invoiceForm.value.dueDate.day + 1].join('-'),
        reference: this.invoiceForm.value.reference,
        subTotal: 0,
        discRate: 0,
        discount: 0,
        vatTax: 0,
        amountPaid: 0,
        note: this.invoiceForm.value.notes,
        term: this.invoiceForm.value.termCondition,
        status: '',
        clientId: this.invoiceForm.value.contactName.clientId,
        clientName: this.invoiceForm.value.contactName.clientName,
        address: this.invoiceForm.value.contactName.address,
        taxCode: this.invoiceForm.value.taxCode,
        tag: this.invoiceForm.value.contactName.tag,
        contactName: this.invoiceForm.value.contactName.contactName,
        email: this.invoiceForm.value.contactName.email,
  };
      console.log(this.invoiceForm);
      const requestInvDt = [];
      const data = this.invoiceService.CreateSaleInv(request).subscribe((rs: any) => {
        console.log(rs);
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
              vat:  this.invoiceForm.value.items[i].vat
            };
            requestInvDt.push(requestInvDetail);
          }
          this.invoiceService.CreateSaleInvDetail(requestInvDt).subscribe(xs => {
            this.notify.success('Successfully Deleted');
            // this.router.navigate([`/invoice`]);
          });
        });
      });
      return;
    }
    if (this.invoiceId > 0 && !this.invoiceForm.valid) {

    } else {

    }
    console.log(JSON.stringify(this.invoiceForm.value));
   // this.router.navigate([`/invoice`]);
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
      this.imgURL = reader.result;
    };
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
        this.getPayments(this.invoiceId);
      }
    });
  }
  getPayments(invoiceId: number) {
    this.paymentService.getPaymentIvByid(invoiceId).pipe(debounceTime(500), finalize(() => {
    })).subscribe((i: any) => {
      this.paymentViews = i;
    });
  }
  deletePayment(payments: any) {
    if (payments.length === 0) { return; }
    this.message.confirm('Do you want to delete those payment ?', 'Are you sure ?', () => {
      payments.forEach(element => {
        this.paymentService.deletePayment(element.id).subscribe(() => {
          this.notify.success('Successfully Deleted');
          this.getPayments(this.invoiceId);
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
    dialog.result.then(result => {
      if (result) {
        this.getPayments(this.invoiceId);
      }
    });
  }
  get getTax(): FormGroup {
    return this.fb.group({
      taxRace: [null],
      taxName: [null],
      isChecked: [null],
    });
  }
  addTaxPopup(item: any, index: number): void {
    if (item.value.productName === '') {
      this.message.warning('Please select a product');
      return;
    }
    const arrayControl = this.getFormArray();
    const dialog = this.modalService.open(AddTaxComponent, AppConsts.modalOptionsSmallSize);
    let oldTaxs = [];
    const taxArr = arrayControl.at(index).get('taxs') as AbstractControl;
    if (taxArr.value.length > 0) {
      oldTaxs = taxArr.value.filter(e => {
        return e.isChecked !== null;
      });
    }
    dialog.componentInstance.taxsList = oldTaxs;
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

  private UpdateTaxLine(taxs: Array<any>, control: AbstractControl) {
    let sumTax = 0;
    taxs.forEach(element => {
      if (element.isChecked) {
        const taxFormsArray = control.get('taxs') as FormArray;
        taxFormsArray.push(this.getTax);
        sumTax += Number(element.taxRace);
      }
    });
    control.get('vat').patchValue(sumTax);
    control.get('taxs').patchValue(taxs);
  }
  editClient() {
    this.isEditClient = true;
  }
  deleteClient() {
    this.isEditClient = true;
    this.clientSelected = new ClientSearchModel();
  }
  redirectToEditInvoice() {
    this.invoiceForm.enable();
    this.router.navigate([`/invoice/${this.invoiceId}/${ActionType.Edit}`]);
  }
  close(result: boolean): void {
    this.activeModal.close(result);
  }
}
