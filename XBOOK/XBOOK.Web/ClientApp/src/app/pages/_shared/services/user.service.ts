import { Observable } from 'rxjs';
import { RegisterViewModel } from '../models/user/registerView.model';
import { map } from 'rxjs/operators';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';

export class UserService extends BaseService {
    deleteUser(id: any) {
        return this.post(`${API_URI.deleteUser}`, id);
      }
    getUserById(id): Observable<any> {
        return this.post<any>(`${API_URI.getUserById}/${id}`, null);
    }
    // getAllUser(): Observable<any> {
    //     return this.post<any>(`${API_URI.getAllUser}`, null);
    // }
    getAllUser(term: any) {
        const products = this.post<any[]>(`${API_URI.getAllUser}`, term)
          .pipe(
          //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return (
                  data.length !== 0 ? data as any[] : new Array<any>()
                );
              },
            ));
        return products;
      }

    updateUser(rq): Observable<any> {
        return this.put<any>(`${API_URI.updateUserData}`, rq);
    }
    createUser(rq): Observable<any> {
        return this.post<any>(`${API_URI.adminUser}`, rq);
    }
    createAdminRole(): Observable<any> {
        return this.post<any>(`${API_URI.adminRole}`, null);
    }
    addUserToAdminRole(request): Observable<any> {
        return this.post<any>(`${API_URI.adminUserAdminRole}`, request);
    }
    checkUserAcount(): Observable<boolean> {
        return this.post<boolean>(`${API_URI.checkAcount}`, null);
    }
    register(request): Observable<RegisterViewModel> {
        return this.post<RegisterViewModel>(`${API_URI.register}`, request);
    }
}
