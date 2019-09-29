import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationDefinitionService {
    constructor(private httpClient: HttpClient) {
    }

    getApplication() {
        const url = '/api/ApplicationDefinition';
        return this.httpClient.get(url);
    }

    getApplicationVersion(versionId) {
        const url = '/api/ApplicationDefinition/GetVersion/' + versionId;
        return this.httpClient.get(url);
    }

    createApplication(application) {
        const url = '/api/ApplicationDefinition';
        return this.httpClient.post(url, application);
    }

    createApplicationVersion(version) {
        const url = '/api/ApplicationDefinition/CreateVersion';
        return this.httpClient.post(url, version);
    }

    updateApplication(id, application) {
        const url = '/api/ApplicationDefinition/' + id;
        return this.httpClient.put(url, application);
    }

    updateApplicationVersion(versionId, version) {
        const url = '/api/ApplicationDefinition/UpdateVersion/' + versionId;
        return this.httpClient.put(url, version);
    }

}
