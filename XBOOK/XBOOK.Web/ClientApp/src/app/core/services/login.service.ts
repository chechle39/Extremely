import { BaseService } from '@shared/service/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginViewModel } from '@modules/_shared/models/login/login.model';
import { API_URI } from 'environments/app.config';
@Injectable()
export class LoginService extends BaseService {
    login(request): Observable<LoginViewModel> {
        return this.post<LoginViewModel>(
            `${API_URI.login}`, request
        );
    }
}
