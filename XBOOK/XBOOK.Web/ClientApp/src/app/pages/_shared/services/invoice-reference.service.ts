import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '../../../shared/service/base.service';
import { InvoiceReferenceRequest } from '../models/invoice-reference/invoice-refernce-request';
import { InvoiceReferenceView } from '../models/invoice-reference/invoice-reference-view';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class InvoiceReferenceService extends BaseService {
    getInvoiceRefernce(request: any): Observable<InvoiceReferenceView[]>{
        return this.post(`${API_URI.getUnTaxDeclaredInvoice}`, request);
    }
}

