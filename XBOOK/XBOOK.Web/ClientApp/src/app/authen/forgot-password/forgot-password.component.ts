import { Component, OnInit, Injector } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '../../coreapp/app-base.component';

@Component({
    selector: 'xb-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends AppComponentBase implements OnInit {
    public loginForm: FormGroup;
    public constructor(
        public fb: FormBuilder,
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
    login(e) {}
}

