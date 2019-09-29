import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SaleInvoiceService {
    constructor(private httpClient: HttpClient) {
    }

    getSaleInvoice(request: any) {
        const url = '/api/SaleInvoice/GetAllSaleInvoice';
        return this.httpClient.post(url,request);
    }
}
