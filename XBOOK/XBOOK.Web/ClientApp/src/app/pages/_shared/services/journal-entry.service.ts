import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JournalEntryViewModel, DataMap } from '../models/journalentry/journalentry.model';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';

@Injectable()
export class JournalEntryService extends BaseService {
  searchJournal(term: any) {
    const products = this.post<JournalEntryViewModel[]>(`${API_URI.JournalGetAll}`, term)
      .pipe(
        //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as JournalEntryViewModel[] : new Array<JournalEntryViewModel>()
            );
          },
        ));

    return products;
  }

  searchJourMap(term: any) {
    const clients = this.post<DataMap[]>(`${API_URI.dataMap}`, term)
      .pipe(
        //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as DataMap[] : new Array<DataMap>()
            );
          },
        ));

    return clients;
  }
  createJournal(rq: any): Observable<any> {
    return this.post<any>(`${API_URI.createJournal}`, rq);
  }
  updateJournal(rq: any): Observable<any> {
    return this.put<any>(`${API_URI.updateJournal}`, rq);
  }
  journalDelete(rq: any): Observable<any> {
    return this.post<any>(`${API_URI.deleteJournalDetail}`, rq);
  }
  getJournalById(id): Observable<any> {
    return this.post<any>(`${API_URI.getJournalById}/${id}`, null);
  }
  deleteJournalById(id: any) {
    return this.post(`${API_URI.deleteJournal}`, id);
  }
}
