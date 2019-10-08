import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../providers/appuser.service';
import { SaleInvoiceService } from '../../providers/saleinvoice.service';
import { NbCheckboxComponent } from '@nebular/theme';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('xx', { static: false }) xx: ElementRef;
  headElements = ['Client / Invoice Number ', 'Notes', 'Issued / Duce Date', 'Amount / Status'];
  listCount: any[];
  Count: any = 0;
  check: any[] = [];
  requestData: any = {
    keyword: null,
    startDate: null,
    endDate: null,
    searchConditions: true
  };
  isCheck: boolean = false;
  saleInvList: model[];
  yy: any;
  constructor(
    private saleInvoiceService: SaleInvoiceService) {
  }
  ngOnInit() {
    this.isCheck = false;
    this.getSaleInvData();
    console.log(this.saleInvList)
    // this.addListData(this.saleInvList);
  }

  getSaleInvData() {
    this.saleInvoiceService.getSaleInvoice(this.requestData).subscribe((rs: model[]) => {
      this.saleInvList = rs;
      const x = rs;
      this.addListData(x)
    })
  }

  getCheckboxesValue(e: any) {
    this.isCheck = !e;
    console.log(this.isCheck);
    this.dataCheck(this.isCheck);
  }

  addListData(lisData: any[]) {
    for (let i = 0; i < lisData.length; i++) {
      lisData[i].isCheck = false;
    }
    console.log(lisData);
    return this.saleInvList = lisData;
  }

  dataCheck(e) {
    this.check = [];
    for (let i = 0; i < this.saleInvList.length; i++) {
      this.saleInvList[i].isCheck = e;
      this.check.push(this.saleInvList[i]);
    }
    this.yy = e;
    if (e === true) {
      this.listCount = this.check;
      let tong = 0;
      for (let i = 0; i < this.saleInvList.length; i++) {
        tong = tong + this.saleInvList[i].amountPaid;
      }
      this.Count = tong;
    }else {
      this.check = [];
      this.listCount = this.check;
      this.Count = 0;
    }
  }

  countAmount(e, item: any) {
    
    if (this.listCount !== undefined) {
      const checkNull = this.listCount.filter(x => x.invoiceId === item.invoiceId);
      if (checkNull.length > 0) {
        this.listCount.splice(this.listCount.findIndex(x => x.invoiceId === item.invoiceId), 1);
      } else {
        this.check.push(item);
      }
    } else {
      this.check.push(item);
    }


    if (this.check.length>0){
      this.listCount = this.check;
    }
    if (this.listCount.length === 0) {
      this.listCount = undefined;
      this.Count = 0;
    } else {
      let tong = 0;
      for (let i = 0; i < this.listCount.length; i++) {
        tong = tong + this.listCount[i].amountPaid;
      }
      this.Count = tong;
    }
  }
}

export interface model {
  invoiceId: number;
  invoiceSerial: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientId: number;
  reference: string
  subTotal: number;
  discRate: number;
  discount: number;
  vatTax: number;
  amountPaid: number;
  note: string;
  term: string;
  status: string;
  saleInvDetailView: {
    id: number;
    invoiceId: number;
    productId: number;
    productName: string;
    description: string;
    qty: number;
    price: number;
    amount: number;
    vat: number;
  };
  paymentView: {
    id: number;
    invoiceId: number;
    payDate: string;
    payTypeID: number;
    payType: string;
    bankAccount: string;
    amount: number;
    note: string;
  };
  clientData: {
    clientId: number;
    clientName: string;
    address: string;
    taxCode: string;
    tag: string;
    contactName: string;
    email: string;
    note: string;
  }
  isCheck: boolean;
}
