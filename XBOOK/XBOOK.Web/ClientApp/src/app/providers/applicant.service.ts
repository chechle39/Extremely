import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicantService {
    constructor(private httpClient: HttpClient) {
    }

    startApplication(data: any) {
        const url = '/api/Applicant';
        return this.httpClient.post(url, data);
    }

    getListApplications(applicantId: string) {
        const url = `/api/applicant/${applicantId}`;
        return this.httpClient.get(url);
    }
}