import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { debounceTime, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProductSearchModel } from '../models/product/product-search.model';
import { ProductView } from '../models/product/product-view.model';
import { Observable } from 'rxjs';
@Injectable()
export class TaxService extends BaseService {

    getAll(): Observable<any> {
        return this.post<any>(`${API_URI.taxGetAll}`,null);
    }
}
