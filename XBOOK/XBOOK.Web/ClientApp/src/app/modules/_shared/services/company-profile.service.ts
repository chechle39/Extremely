import { API_URI } from 'environments/app.config';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '@shared/service/base.service';
// import { ClientSearchModel } from '../models/client/client-search.model';
import { CompanyprofileView} from '../models/companyprofile/companyprofile-view.model';
import { Observable } from 'rxjs';
@Injectable()
export class CompanyService extends BaseService {

  getProfile(id: any): Observable<CompanyprofileView> {
    return this.post<CompanyprofileView>(
      `${API_URI.companyProfileById}/${id}`, id
    );
  }
  createProfile(company: CompanyprofileView): Observable<CompanyprofileView> {
    return this.post<CompanyprofileView>(`${API_URI.createProfile}`, company);
  }
  updateProfile(company: CompanyprofileView) {
    return this.put<CompanyprofileView>(`${API_URI.updateCompanyProfile}`, company);
  }
  getInfoProfile(): Observable<any> {
    return this.post<any>(`${API_URI.getcompanyProfile}`, null);
  }

}
