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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService) {
    //this.createForm();
  }

  ngOnInit() {
    // this.route.queryParams
    //   .subscribe(params => this.returnUrl = params.return || '/dashboard');
  }
  login() {
    const login$ = this.authenticationService.login(this.loginContext);
    this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
  }
}
