import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '../../coreapp/app-base.component';
import { DataService } from '../../pages/_shared/services/data.service';
import { LoginService } from '../../coreapp/services/login.service';
@Component({
  selector: 'xb-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  extends AppComponentBase implements OnInit {
  public loginForm: FormGroup;
  isCheckForm: boolean;
  isAccountNotExit: boolean;
  code: string;
  @Output() closed = new EventEmitter();
  @Output() back = new EventEmitter();
  constructor(
    injector: Injector,
    public fb: FormBuilder,
    private data: DataService,
    private login: LoginService) {
    super(injector);
    this.loginForm = this.createForm();
  }
  ngOnInit(): void {

  }
  public resetPass(submittedForm: FormGroup) {
    this.data.getMessageCodeToFormReset().subscribe(rpx => {
      this.code = rpx.data.code;
      const request = {
        email: rpx.data.email,
        password: submittedForm.value.password,
        confirmPassword: submittedForm.value.confirmPassword,
        code: this.code,
      };
      this.login.resetPassWord(request).subscribe( rp => {
        if (rp.success === false) {
          this.message.error(rp.message, 'Please use email correctly!.');
        } else {
          this.message.confirmNotContent('Change password success.', () => {
            this.onClose();
          });
        }
      }, () => {
        this.notify.error('Error');
      });
    });

  }

  createForm() {
    return this.fb.group({
      password: [null, [Validators.required]],
      email: [null, [Validators.email]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  onClose() {
      this.closed.emit();
  }

  onClickBackButton() {
    this.back.emit();
  }
}

