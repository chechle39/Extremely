// import { Component, OnInit, Injector } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthenticationService, LoginContext } from '@core/services/authentication.service';
// import { LoginViewModel } from '@modules/_shared/models/login/login.model';
// import { LoginService } from '@core/services/login.service';
// import { UserService } from '@modules/_shared/services/user.service';
// import { RegisterViewModel } from '@modules/_shared/models/user/registerView.model';
// import { AppComponentBase } from '@core/app-base.component';

// @Component({
//   selector: 'xb-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent extends AppComponentBase implements OnInit  {
//   public loginForm: FormGroup;
//   isCheckForm: boolean;
//   constructor(
//     injector: Injector,
//     public fb: FormBuilder,
//     private router: Router,
//     private loginService: LoginService,
//     private route: ActivatedRoute,
//     private userService: UserService,
//     private authenticationService: AuthenticationService) {
//       super(injector);
//       this.loginForm = this.createForm();
//   }

//   ngOnInit() {
//     this.checkAcount();
//     // this.route.queryParams
//     //   .subscribe(params => this.returnUrl = params.return || '/dashboard');
//   }

//   private checkAcount(): void {
//     this.userService.checkUserAcount().subscribe((rp: boolean) => {
//       this.isCheckForm = rp;
//     });
//   }

//   async login(submittedForm: FormGroup) {

//     if (this.isCheckForm !== false) {
//       const rq = {
//         email: submittedForm.value.userName,
//         password: submittedForm.value.password
//       } as LoginViewModel;
//       try {
//         this.loginService.login(rq).subscribe((rp: any) => {
//           const request = {
//             username: submittedForm.value.userName,
//             password: submittedForm.value.password,
//             token: null
//           } as LoginContext;
//           const login$ = this.authenticationService.login(request);
//           this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
//         });
//       } catch (err) {
//         console.log('xxx');
//       }
//     } else {
//       const birthDay = submittedForm.controls.birthDay.value;
//       const request = {
//         email: submittedForm.value.email,
//         address: submittedForm.value.address,
//         avatar: null,
//         birthDay: [birthDay.year, birthDay.month, birthDay.day].join('-'),
//         confirmPassword: submittedForm.value.confirmPassword,
//         fullName: submittedForm.value.fullName,
//         password: submittedForm.value.password,
//         phoneNumber: submittedForm.value.phoneNumber,
//       } as RegisterViewModel;
//       this.userService.register(request).subscribe((rp: RegisterViewModel) => {
//         this.userService.createAdminRole().subscribe(() => {
//           this.userService.addUserToAdminRole({email: submittedForm.value.email}).subscribe(() => {
//             console.log('xxx');
//             this.message.confirm1('create acount success', 'vui lòng comfirm mail', () => {
//               this.isCheckForm = true;

//             });
//           });
//         });
//       });
//     }




//   }

//   createForm() {
//     return this.fb.group({
//       userName: [null, [Validators.required]],
//       password: [null, [Validators.required]],
//       fullName: [null, [Validators.required]],
//       email: [null, [Validators.required, Validators.email]],
//       confirmPassword: [null, [Validators.required]],
//       address: [null, [Validators.required]],
//       phoneNumber: [null, [Validators.required]],
//       birthDay: [null, [Validators.required]],
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { I18nService } from '@core/services/i18n.service';
import { AuthenticationService, LoginContext } from '@core/services/authentication.service';

@Component({
  selector: 'xb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginContext: LoginContext = { username: 'admin', password: '' };
  isCheckForm: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService) {
    // this.createForm();
  }

  ngOnInit() {
    this.isCheckForm = true;
    // this.route.queryParams
    //   .subscribe(params => this.returnUrl = params.return || '/dashboard');
  }
  login() {
    const login$ = this.authenticationService.login(this.loginContext);
    this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
  }
}
