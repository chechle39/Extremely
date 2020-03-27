import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/service/base.service';
import { LoginViewModel } from '../../pages/_shared/models/login/login.model';
import { API_URI } from '../../../environments/app.config';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class LoginService extends BaseService {
    login(request): Observable<LoginViewModel> {
        return this.post<LoginViewModel>(
            `${API_URI.login}`, request,
        );
    }

    logOut(): Observable<any> {
        return this.post<any>(
            `${API_URI.logout}`, null,
        );
    }
    checkMail(rq): Observable<any> {
        return this.post<any>(
            `${API_URI.checkEmail}`, rq,
        );
    }
    resetPassWord(rq): Observable<any> {
        return this.post<any>(
            `${API_URI.resetPass}`, rq,
        );
    }
}
