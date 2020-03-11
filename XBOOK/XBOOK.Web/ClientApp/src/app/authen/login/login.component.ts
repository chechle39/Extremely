import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '../../coreapp/app-base.component';
import { LoginService } from '../../coreapp/services/login.service';
import { UserService } from '../../pages/_shared/services/user.service';
import { AuthenticationService, LoginContext } from '../../coreapp/services/authentication.service';
import { LoginViewModel } from '../../pages/_shared/models/login/login.model';
@Component({
    selector: 'xb-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends AppComponentBase implements OnInit {
    public loginForm: FormGroup;
    isCheckForm: boolean;
    isAccountNotExit: boolean;
    loading = false;
    isCheck: boolean = true;
    constructor(
        injector: Injector,
        public fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private loginService: LoginService,
        private authenticationService: AuthenticationService) {
        super(injector);
        this.loginForm = this.createForm();
    }

    ngOnInit() {
        this.checkAcount();
    }

    private checkAcount(): void {
        this.userService.checkUserAcount().subscribe((rp: boolean) => {
            if (rp === false) {
                this.router.navigate([`/auth/register`]);
            }
        });
    }

    public login(submittedForm: FormGroup) {
        const rq = {
            email: submittedForm.value.userName,
            password: submittedForm.value.password,
        } as LoginViewModel;

        this.loginService.login(rq).subscribe((rp: any) => {
            const request = {
                username: submittedForm.value.userName,
                password: submittedForm.value.password,
                token: rp.auth_token,
                role: rp.role,
                permission: rp.permission,
            } as LoginContext;
            if (rp.success === false) {
                this.message.error(rp.message, 'Wrong login, please login again');
                this.isCheck = rp.success;
            } else {
                this.loading = true;
                const login$ = this.authenticationService.login(request);
                this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
            }

        }, (er) => {
        });
    }

    createForm() {
        return this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required] ],
        });
    }
}

