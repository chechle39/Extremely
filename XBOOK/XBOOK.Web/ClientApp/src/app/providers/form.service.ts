import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { ApplicationDependantAppendix } from '../shared/models/application-dependant-appendix';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class FormService {
    private baseUrl: String = '/api/Form/';

    constructor(private httpClient: HttpClient) {
    }

    updateFormData(applicantId: Number, appId: Number, appDependantAppendixId: Number, data: String): Observable<any> {
        const url = `${this.baseUrl}UpdateFormData/${applicantId}/${appId}/${appDependantAppendixId}`;
        return this.httpClient
            .put(url, { Content: data })
            .pipe(
                map((body: any) => {
                    return body;
                }),
                catchError((err) => {
                    throwError('An error occured when processing submitForm', err);
                    return [];
                }),
            );
    }

    getFormData(appDependantAppendixId: Number): Observable<ApplicationDependantAppendix> {
        const url = `${this.baseUrl}GetFormData/${appDependantAppendixId}`;
        return this.httpClient
            .get(url)
            .pipe(
                map((body: any) => {
                    return new ApplicationDependantAppendix(body);
                }),
                catchError((err) => {
                    throwError('An error occured when processing getFormData', err);
                    return [];
                }),
            );
    }
}
