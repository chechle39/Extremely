import { Observable } from 'rxjs';
import { RoleModel } from '../models/role/role.model';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';

export class RoleService extends BaseService {
    getAllRole(): Observable<RoleModel> {
        return this.post<RoleModel>(`${API_URI.getListRole}`, null);
      }
}
