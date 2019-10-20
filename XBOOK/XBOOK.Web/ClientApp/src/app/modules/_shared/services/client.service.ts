import { API_URI } from 'environments/app.config';
import { debounceTime, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
import { ClientSearchModel } from '../models/client/client-search.model';
import { ClientView } from '../models/client/client-view.model';
import { Observable } from 'rxjs';
@Injectable()
export class ClientService extends BaseService {
  url = API_URI.client;
  // searchClient(term: string) {
  //   const clients = this.get<ClientSearchModel[]>(`${this.url}/?q=${term}`)
  //     .pipe(
  //       debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
  //       map(
  //         (data: any) => {
  //           return (
  //             data.length !== 0 ? data as ClientSearchModel[] : new Array<ClientSearchModel>()
  //           );
  //         }
  //       ));

  //   return clients;
  // }
  searchClient(term: any) {
    const clients = this.post<ClientSearchModel[]>(`${API_URI.clientAll}`, term)
      .pipe(
      //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as ClientSearchModel[] : new Array<ClientSearchModel>()
            );
          }
        ));

    return clients;
  }
  getAll(term: string): Observable<ClientView[]> {
    return this.get<ClientView[]>(
      `${this.url}/?q=${term}`
    );
  }
  getClient(id: any): Observable<ClientView> {
    return this.post<ClientView>(
      `${API_URI.clientById}/${id}`, id
    );
  }
  createClient(client: ClientView): Observable<ClientView> {
    return this.post<ClientView>(`${API_URI.createClient}`, client);
  }
  updateClient(client: ClientView) {
    return this.put<ClientView>(`${API_URI.updateClient}`, client);
  }
  deleteClient(id: number) {
    return this.post(`${API_URI.deleteClient}/${id}`, id );  }
}
