import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    EntryBatternViewModel,
    EntryPatternRequest,
    TransactionTypeRequest } from '../models/Entry-Pattern/entry-pattern.model';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class EntryBatternService extends BaseService {
    getAllEntry(): Observable<EntryBatternViewModel[]> {
        return this.post<EntryBatternViewModel[]>(`${API_URI.getAllEntryURL}`, null);
    }
    getAllEntryPayment(): Observable<EntryBatternViewModel[]> {
        return this.post<EntryBatternViewModel[]>(`${API_URI.getAllEntryPaymentURL}`, null);
    }
    getEntry(request: EntryPatternRequest): Observable<any[]> {
        return this.post<any>(`${API_URI.getEntryURL}`, request);
    }
    getSearchData(): Observable<any> {
        return this.post<any>(`${API_URI.getEntryPatternSearchData}`, null);
    }
    getTransactionType(): Observable<any> {
        return this.post<any>(`${API_URI.getTransactionType}`, null);
    }
    getEntryTypeByTransactionType(request: TransactionTypeRequest): Observable<any> {
        return this.post<any>(`${API_URI.getEntryTypeByTransactionType}`, request);
    }
    updateEntryPartern(request: EntryBatternViewModel[]): Observable<any> {
        return this.post<any>(`${API_URI.updateEntryPattern}`, request);
    }
}
