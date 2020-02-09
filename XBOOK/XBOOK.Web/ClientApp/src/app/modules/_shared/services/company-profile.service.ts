import { API_URI } from 'environments/app.config';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
// import { ClientSearchModel } from '../models/client/client-search.model';
import { CompanyprofileView} from '../models/companyprofile/companyprofile-view.model';
import { Observable } from 'rxjs';
@Injectable()
export class CompanyService extends BaseService {

  // getClient(id: any): Observable<ClientView> {
  //   return this.post<ClientView>(
  //     `${API_URI.clientById}/${id}`, id
  //   );
  // }
  createProfile(client: CompanyprofileView): Observable<CompanyprofileView> {
    return this.post<CompanyprofileView>(`${API_URI.createProfile}`, client);
  }
  // updateClient(client: ClientView) {
  //   return this.put<ClientView>(`${API_URI.updateClient}`, client);
  // }
  // deleteClient(id: any) {
  //   return this.post(`${API_URI.deleteClient}`, id);
  // }

  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getcompanyProfile}`, null);
  }

}
