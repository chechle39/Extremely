import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {
    constructor() {
    }

    get userEmail() {
        return localStorage.getItem('currentLogin');
    }

    login(email: string) {
        localStorage.setItem('currentLogin', email);
    }
}
