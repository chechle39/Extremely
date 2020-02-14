import { BaseService } from '@shared/service/base.service';
import { Observable } from 'rxjs';
import { API_URI } from 'environments/app.config';
import { RegisterViewModel } from '../models/user/registerView.model';

export class UserService extends BaseService {
    getAllUser(): Observable<any> {
        return this.post<any>(`${API_URI.getAllUser}`, null);
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
