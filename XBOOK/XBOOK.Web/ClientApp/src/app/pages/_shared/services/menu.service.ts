import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { MenuViewModel } from '../models/menu/menu.model';
import { FuncModel } from '../models/menu/func.model';

@Injectable()
export class MenuService extends BaseService {
    getAllMenu(): Observable<MenuViewModel> {
        return this.post<MenuViewModel>(`${API_URI.getAllMenu}`, null);
    }
    getAllFunction(): Observable<FuncModel[]> {
        return this.post<FuncModel[]>(`${API_URI.getAllFunc}`, null);
    }
}
