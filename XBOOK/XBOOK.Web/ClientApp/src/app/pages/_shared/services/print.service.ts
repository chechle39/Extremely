import { BaseService } from '../../../shared/service/base.service';
import { Observable } from 'rxjs';
import { API_URI } from '../../../../environments/app.config';
import { RegisterViewModel } from '../models/user/registerView.model';

export class PrintService extends BaseService {
    ReadNameReport(): Observable<any> {
        return this.post<any>(`${API_URI.ReadNameReport}`, null);
    }
}
