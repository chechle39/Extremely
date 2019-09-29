import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppendixProperty } from '../shared/models';

@Injectable()
export class AppendixService {
    constructor(private httpClient: HttpClient) {
    }

    getAllAppendixes() {
        const url = '/api/Appendix';
        return this.httpClient
            .get(url)
            .pipe(map((body: any) => {
                return body.map((i: any) => {
                    i.version = i.versions ? i.versions[i.versions.length - 1].version : 0;
                    return i;
                });
            }));
    }

    getAppendixProperty() {
        const url = '/api/AppendixProperty';
        return this.httpClient.get(url);
    }

    getAppendixSchema(versionId) {
        const url = '/api/Appendix/schema/' + versionId;
        return this.httpClient.get(url);
    }

    getAppendixVersion(versionId) {
        const url = '/api/Appendix/GetVersion/' + versionId;
        return this.httpClient
            .get(url)
            .pipe(
                map((body: any) => {
                    body.properties = body.properties.map((i: any) => new AppendixProperty(i));
                    return body;
                }),
            );
    }

    createAppendix(appendix) {
        const url = '/api/Appendix';
        return this.httpClient.post(url, appendix);
    }

    createAppendixVersion(typeId, version) {
        const url = '/api/Appendix/CreateVersion/' + typeId;
        return this.httpClient.post(url, version);
    }

    updateAppendix(id, appendix) {
        const url = '/api/Appendix/' + id;
        return this.httpClient.put(url, appendix);
    }

    updateAppendixVersionSchema(versionId, version) {
        const url = '/api/Appendix/UpdateVersionSchema/' + versionId;
        return this.httpClient.put(url, version);
    }

    updateAppendixVersionAndProperties(versionId, version) {
        const url = '/api/Appendix/UpdateVersionAndProperties/' + versionId;
        return this.httpClient.put(url, version);
    }

    creaApplication(version) {
        const url = '/api/ApplicantApplication/';
        return this.httpClient.post(url, version);
    }
}
