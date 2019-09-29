import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PipeLineService {
    constructor(private httpClient: HttpClient) {
    }

    getPipeLine(id: any) {
        const url = '/api/Pipeline/' + id;
        return this.httpClient.get(url, id);
    }
}
