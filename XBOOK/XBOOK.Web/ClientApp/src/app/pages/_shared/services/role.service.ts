import { Observable } from 'rxjs';
import { RoleModel } from '../models/role/role.model';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
import { map } from 'rxjs/operators';

export class RoleService extends BaseService {
  createRole(rq): Observable<any> {
    return this.post<any>(`${API_URI.saveRole}`, rq);
  }
  deleteRole(id: any) {
    return this.post(`${API_URI.deleteRole}`, id);
  }
  getRoleById(id): Observable<any> {
    return this.post<any>(`${API_URI.getRoleById}/${id}`, null);
  }
  getAllRole(term: any) {
    const role = this.post<RoleModel[]>(`${API_URI.getListRole}`, term).pipe(
      map((data: any) => {
        return (
          data.length !== 0 ? data as any[] : new Array<any>()
        );
      }),
    );
    return role;
  }
}
