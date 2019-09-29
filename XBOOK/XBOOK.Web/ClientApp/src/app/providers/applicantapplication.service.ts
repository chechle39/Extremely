import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicantApplicationService {
    constructor(private httpClient: HttpClient) {
    }
    getListApplications(applicantId: string) {
        const url = `/api/ApplicantApplication/${applicantId}`;
        return this.httpClient.get(url);
    }

    getListApplicationsDetail(applicantId: any) {
        const url = `/api/ApplicantApplication/Detail/${applicantId}`;
        return this.httpClient.get(url);
    }
}
