import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class UserService {
    constructor(private httpClient: HttpClient) {
    }

    // getUser() {
    //     const url = '/api/Security/UserProfile';
    //     return this.httpClient.get(url);
    // }

    createUser(user) {
        const url = '/api/User';
        return this.httpClient.post(url, user);
    }

    getLogin() {
        const url = '/api/Security';
        return this.httpClient.post(url, null);
    }

    update(user) {
        const url = '/api/User';
        return this.httpClient.put(url, user);
    }

    getUserData() {
        const url = '/api/User/';
        return this.httpClient.get(url);
    }

    getByID(id) {
        const url = '/api/User/' + id;
        return this.httpClient.get(url, id);
    }

    getUserRoleApplicant() {
        const url = '/api/User/FilterUserRole';
        return this.httpClient.get(url);
    }

    getUserAgent(email: any) {
        const url = '/api/User/FindUserLogin/' + email;
        return this.httpClient.get(url, email);
    }
}
