import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '../../coreapp/app-base.component';
import { UserService } from '../../pages/_shared/services/user.service';
import { RegisterViewModel } from '../../pages/_shared/models/user/registerView.model';
@Component({
  selector: 'xb-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends AppComponentBase {
  public loginForm: FormGroup;
  isCheckForm: boolean;
  isAccountNotExit: boolean;
  constructor(
    injector: Injector,
    public fb: FormBuilder,
    private router: Router,
    private userService: UserService) {
    super(injector);
    this.loginForm = this.createForm();
  }
  public register(submittedForm: FormGroup) {
    const birthDay = submittedForm.controls.birthDay.value;
    const request = {
      email: submittedForm.value.email,
      address: submittedForm.value.address,
      avatar: null,
      birthDay: [birthDay.year, birthDay.month, birthDay.day].join('-'),
      confirmPassword: submittedForm.value.confirmPassword,
      fullName: submittedForm.value.fullName,
      password: submittedForm.value.password,
      phoneNumber: submittedForm.value.phoneNumber,
    } as RegisterViewModel;
    this.userService.register(request).subscribe((rp: RegisterViewModel) => {
      this.userService.createAdminRole().subscribe(() => {
        this.userService.addUserToAdminRole({ email: submittedForm.value.email }).subscribe(() => {
          this.message.confirm1('create acount success', 'vui lòng comfirm mail', () => {
            this.router.navigate([`/auth/login`]);
          });
        });
      });
    });
  }

  createForm() {
    return this.fb.group({
      password: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.email]],
      confirmPassword: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      birthDay: [null, [Validators.required]],
    });
  }
}

