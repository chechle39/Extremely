import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { Observable } from 'rxjs';
import { EntryBatternViewModel } from '../models/Entry-Pattern/entry-pattern.model';
import { API_URI } from 'environments/app.config';

@Injectable()
export class EntryBatternService extends BaseService {
    getAllEntry(): Observable<EntryBatternViewModel[]> {
        return this.post<EntryBatternViewModel[]>(`${API_URI.getAllEntryURL}`, null);
    }
}
