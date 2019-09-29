import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppendixProperty } from '../shared/models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AssemblyService {
    private baseUrl: String = '/api/Assembly/';

    constructor(private httpClient: HttpClient) {
    }

    getAllAssemblyAppendixes() {
        const url = `${this.baseUrl}GetAllAppendixes`;
        return this.httpClient.get(url);
    }

    validateFormData(assemblyAppendixName: String, assemblyAppendixVersion: String, data: any) {
        const url = `${this.baseUrl}ValidateFormInputData/${assemblyAppendixName}/${assemblyAppendixVersion}`;
        return this.httpClient.post(url, data);
    }

    generateAppendixProperties(
        assemblyAppendixName: String,
        assemblyAppendixVersion: String): Observable<AppendixProperty[]> {
        const url = `${this.baseUrl}GenerateAppendixProperties/${assemblyAppendixName}/${assemblyAppendixVersion}`;
        return this.httpClient
            .get(url)
            .pipe(
                map((body: any) => {
                    return body.map((i: any) => new AppendixProperty(i));
                }),
                catchError((err) => {
                    throwError('Could not load any AppendixProperties', err);
                    return [];
                  }),
            );
    }
}
