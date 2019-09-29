import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AgentDashBoardService {
    constructor(private httpClient: HttpClient) {
    }


    agentDashBoard() {
        const url = `/api/AgentDashboard/`;
        return this.httpClient.get(url);
    }
}
