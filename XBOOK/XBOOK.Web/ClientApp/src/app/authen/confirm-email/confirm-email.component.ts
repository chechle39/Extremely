import { Component, OnInit, Output, EventEmitter, ViewChild, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../../pages/_shared/services/data.service';
import { LoginService } from '../../coreapp/services/login.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { AppComponentBase } from '../../coreapp/app-base.component';

@Component({
  selector: 'xb-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {
  @Output() closed = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  public loginForm: FormGroup;
  flag: boolean = true;
  code: string;
  email: string;
  constructor(
    public fb: FormBuilder,
    private data: DataService,
    injector: Injector,
    private loginService: LoginService,
  ) {
    super(injector);
    this.loginForm = this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    return this.fb.group({
      code: [null, [Validators.required]],
    });
  }


  login(e) {
    this.flag = true;
    this.data.getMessageCode().subscribe(rp => {
      if (this.flag) {
        this.code = rp.data.code;
        this.email = (rp.data.email.email === undefined) ? rp.data.email : rp.data.email.email;
      }
      const lastCode = this.code.split('b24ctcp')[0] + e.value.code + this.code.split('b24ctcp')[1];
      const dataRS = {
        code: lastCode,
        email: this.email,
      };
      if (this.email.length > 0 ) {
        const request = {
          email: this.email,
          password: 'xxx',
          confirmPassword: 'xxx',
          code: lastCode,
        };
        this.loginService.resetPassWord(request).subscribe( rpx => {
          if (rpx.message === 'InvalidToken') {
              this.flag = false;
          } else {
            this.data.sendMessageCodeToFormReset(dataRS);
            this.next.emit();
          }
        });
      } else {
        return;
      }

    });
  }
  reSendCode() {
    const request = {
      email: this.email,
    };
    this.loginService.checkMail(request).subscribe(rp => {
      if (rp.success === false ) {
          this.message.error(rp.message, 'Please use email correctly!.');
      } else {
          const dataRS = {
              code: rp.message,
              email: this.email,
          };
          this.data.sendMessageCode(dataRS);
          this.message.confirmNotContentNoCallBack('Kiểm tra email để lấy code');
      }
  }, () => {
      this.notify.error('Error');
  });
  }
  onClickBackButton() {
    this.back.emit();
  }

  onClose() {
      this.closed.emit();
  }
}
