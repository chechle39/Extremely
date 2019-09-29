import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleService {
    constructor(private httpClient: HttpClient) {
    }

    getRole() {
        const url = '/api/Role';
        return this.httpClient.get(url);
    }

    createRole(role) {
        const url = '/api/Role';
        return this.httpClient.post(url, role);
    }

    update(role) {
        const url = '/api/Role';
        return this.httpClient.put(url, role);
    }

    delete(role) {
        const url = '/api/Role/Delete/' + role;
        return this.httpClient.post(url, role);
    }

    getByID(id) {
        const url = '/api/Role/' + id;
        return this.httpClient.get(url, id);
    }
}
