import { Injectable } from '@angular/core';
import { MessageService } from '../../coreapp/services/message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
    constructor(private message: MessageService, private router: Router) {

    }
    messeage(code) {
        if (code === 403) {
            this.message.errorHandel('bạn không có quyền vào chức năng này, hãy liên hệ với quản trị viên',
            'Access denied'
            , () => {
                this.router.navigate([`/pages`]);
            });
        }
        return;
    }
}
