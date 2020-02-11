import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18nService } from '@core/services/i18n.service';
import { AuthenticationService, LoginContext } from '@core/services/authentication.service';

@Component({
  selector: 'xb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loginContext: LoginContext = { username: 'admin', password: '' };
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
      this.loginForm = this.createForm();
  }

  ngOnInit() {
    // this.route.queryParams
    //   .subscribe(params => this.returnUrl = params.return || '/dashboard');
  }
  login(submittedForm: FormGroup) {
    const request = {
      username: submittedForm.value.userName,
      password: submittedForm.value.password
    } as LoginContext;
    const login$ = this.authenticationService.login(request);
     // const rq = {
    //   email: context.username,
    //   password: context.password
    // } as LoginViewModel;
    // this.loginService.login(rq).subscribe(rp => {
    //   this.credentialsService.setCredentials();
    // });
    this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
  }

  createForm() {
    return this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
