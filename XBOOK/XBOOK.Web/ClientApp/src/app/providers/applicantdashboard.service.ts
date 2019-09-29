import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicantDashBoardService {
    constructor(private httpClient: HttpClient) {
    }


    applicantDashBoard() {
        const url = `/api/ApplicantDashBoard/`;
        return this.httpClient.get(url);
    }
}
