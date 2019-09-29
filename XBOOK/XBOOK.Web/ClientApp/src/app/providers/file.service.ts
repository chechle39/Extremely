import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
    constructor(private httpClient: HttpClient) {
    }

    upload(applicantId: string, file: File) {
        const endpoint = '/api/NominationForm/UploadFile/' + applicantId;
        const formData: FormData = new FormData();
        if (file) {
            formData.append(file.name, file);
        }
        return this.httpClient.post(endpoint, formData);
    }
}
