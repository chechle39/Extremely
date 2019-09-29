import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../providers/appuser.service';
import { SaleInvoiceService } from '../../providers/saleinvoice.service';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  headElements = ['Client / Invoice Number ', 'Notes', 'Issued / Duce Date', 'Amount / Status'];
  requestData: any = {
    keyword: null,
    startDate: null,
    endDate: null,
    searchConditions: true
  };
  isCheck: boolean = false;
  saleInvList: model[];
  constructor(
    private saleInvoiceService: SaleInvoiceService) {
  }
  ngOnInit() {
    this.isCheck = false;
    this.getSaleInvData();
    console.log(this.saleInvList)
    this.addListData(this.saleInvList);
  }

  getSaleInvData(){
    this.saleInvoiceService.getSaleInvoice(this.requestData).subscribe((rs: model[])=>{
     // this.saleInvList = rs;
      const x =  rs;
      this.addListData(x)
    })
  }

  getCheckboxesValue(e: any){
    this.isCheck = !e;
    console.log( this.isCheck );
  }

  addListData(lisData: any[]){
    for (let i = 0; i< lisData.length; i++){
      lisData[i].isCheck = false;
    }
    console.log(lisData);
    return this.saleInvList = lisData;
  }
}

export interface model {
  invoiceId: number;
  invoiceSerial:	string;
  invoiceNumber:	string;
  issueDate:	string;
  dueDate:	string;
  clientId: number;
  reference:	string
  subTotal:	number;
  discRate:	number;
  discount:	number;
  vatTax:	number;
  amountPaid:	number;
  note:	string;
  term:	string;
  status:	string;
  saleInvDetailView: {
    id:	number;
    invoiceId: number;
    productId: number;
    productName:	string;
    description:	string;
    qty:	number;
    price:	number;
    amount:	number;
    vat:	number;
  };
  paymentView: {
    id: number;
    invoiceId: number;
    payDate:	string;
    payTypeID: number;
    payType:	string;
    bankAccount:	string;
    amount: number;
    note:	string;
  };
  clientData: {
    clientId: number;
    clientName:	string;
    address:	string;
    taxCode:	string;
    tag:	string;
    contactName: string;
    email:	string;
    note:	string;
  }
  isCheck: false;
}
