import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FormBuilderService {
    constructor(private httpClient: HttpClient) {
    }

    getFormSchema() {
        const url = '/api/FormBuilder';
        return this.httpClient.get(url);
    }

    savePrincipalCandidate(appicanntId: string, value) {
        const url = '/api/NominationForm/SubmitForm/' + appicanntId + '/CreateApplicationProfile';
        return this.httpClient.post(url, value);
    }

    getCandidate(applicantId: string) {
        const url = '/api/NominationForm/' + applicantId;
        return this.httpClient.get(url);
    }

    getReviewData(applicantId: string) {
        const url = '/api/NominationForm/review/' + applicantId;
        return this.httpClient.get(url);
    }

    submitReview(applicantId: string, data) {
        const url = '/api/NominationForm/TestDynamic/' + applicantId + '/ReviewApplication';
        return this.httpClient.post(url, data);
    }

    startProcess(data) {
        const url = '/api/NominationForm/StartWorkflow';
        return this.httpClient.post(url, data);
    }

    checkStatus(data) {
        const url = '/api/NominationForm/CheckStatus';
        return this.httpClient.post(url, data);
    }

    getUserResource(applicantId: string) {
        const url = '/api/NominationForm/UserResources/' + applicantId;
        return this.httpClient.get(url);
    }
}
