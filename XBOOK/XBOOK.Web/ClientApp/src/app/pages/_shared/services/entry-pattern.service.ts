import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntryBatternViewModel } from '../models/Entry-Pattern/entry-pattern.model';
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
}
