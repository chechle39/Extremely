import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '../../coreapp/app-base.component';
import { LoginService } from '../../coreapp/services/login.service';
import { Router } from '@angular/router';
import { DataService } from '../../pages/_shared/services/data.service';

@Component({
    selector: 'xb-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends AppComponentBase implements OnInit {
    public loginForm: FormGroup;
    @Output() closed = new EventEmitter();
    @Output() next = new EventEmitter();
    public constructor(
        public fb: FormBuilder,
        private data: DataService,
        private loginService: LoginService,
        injector: Injector) {
        super(injector);
        this.loginForm = this.createForm();
    }
    ngOnInit() {
    }

    createForm() {
        return this.fb.group({
            email: [null, [Validators.email, Validators.required]],
        });
    }
    login(e) {
        this.loginService.checkMail(e.value).subscribe(rp => {
            if (rp.success === false ) {
                this.message.error(rp.message, 'Please use email correctly!.');
            } else {
                const dataRS = {
                    code: rp.message,
                    email: e.value,
                };
                this.data.sendMessageCode(dataRS);
                this.message.confirmNotContent('Kiểm tra email để lấy code', () => {
                    this.next.emit();
                });
            }
        }, () => {
            this.notify.error('Error');
        });
    }

    onClose() {
        this.closed.emit();
    }
}

