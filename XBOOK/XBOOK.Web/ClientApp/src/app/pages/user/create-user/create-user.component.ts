import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '../../_shared/models/product/product-view.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ProductService } from '../../_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RoleService } from '../../_shared/services/role.service';
import { RoleModel } from '../../_shared/models/role/role.model';
import { SelectItem } from 'primeng/components/common/selectitem';
import { UserService } from '../../_shared/services/user.service';
import { UserViewModel } from '../../_shared/models/user/userview.model';
import { AppConsts } from '../../../coreapp/app.consts';
import * as moment from 'moment';

@Component({
  selector: 'xb-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent extends AppComponentBase implements OnInit {
  // user = {
  //   skills: [
  //     { name: 'Admin', selected: true, id: 12 },
  //     { name: 'Member', selected: false, id: 2 },
  //   ]
  // };
  @Input() title;
  @Input() edit: boolean;
  @Input() id;
  ischeckStatus = '0';
  val1: string;
  selectedCars1: string[] = [];
  cars: any[];
  selectedCars2: string[] = [];
  tempcars: RoleModel[];
  items: SelectItem[];
  saving: false;
  categories: any;
  statusCategory: any;
  product: ProductView = new ProductView();
  public userForm: FormGroup;
  listRole: RoleModel[];
  selectedCities: string[];
  selected = [];
  constructor(
    injector: Injector,
    public roleService: RoleService,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    public userService: UserService,
    public productService: ProductService) {
    super(injector);
  }
  // get skills(): FormArray {
  //   return this.userForm.get('skills') as FormArray;
  // }
  ngOnInit() {
    this.userForm = this.createUserChartFormGroup();
    if (this.edit === true) {
      this.userService.getUserById(this.id).subscribe(rp => {
        const issueDate = moment(rp.birthDay).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = { year: Number(issueDateSplit[2]),
          month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]) };
        this.userForm.patchValue({
          id: rp.id,
          fullName: rp.fullName,
          birthDay: issueDatePicker,
          email: rp.email,
          password: null,
          passwordCF: null,
          address: rp.address,
          phoneNumber: rp.phoneNumber,
          status: rp.status,
          gender: rp.gender,
          // skills: this.buildSkills(),
          role: [''],
        });
        this.selectedCities = rp.roles;
      });
    }
    this.getRole();
  }
  saveUser(submittedForm: FormGroup): void {
    const request = {
      id: submittedForm.controls.id.value,
      address: submittedForm.controls.address.value,
      avatar: '',
      birthDay: [this.userForm.value.birthDay.year,
      this.userForm.value.birthDay.month,
      this.userForm.value.birthDay.day].join('-') === '--' ? '' : [this.userForm.value.birthDay.year,
      this.userForm.value.birthDay.month, this.userForm.value.birthDay.day].join('-'),
      email: submittedForm.controls.email.value,
      fullName: submittedForm.controls.fullName.value,
      gender: submittedForm.controls.gender.value,
      password: submittedForm.controls.password.value,
      phoneNumber: submittedForm.controls.phoneNumber.value,
      roles: submittedForm.controls.role.value,
      status: parseInt(submittedForm.controls.status.value, 2),
    } as UserViewModel;
    if (!this.edit) {
      this.userService.createUser(request).subscribe(rp => {
        this.notify.success('saved successfully');
        this.close(true);
      });
    } else {
      this.userService.updateUser(request).subscribe(rp => {
        this.notify.success('update successfully');
        this.close(true);
      });
    }

  }

  getRole() {
    const rq = {
      keyWord: '',
    };
    this.roleService.getAllRole(rq).pipe().subscribe((rp: any) => {
      this.listRole = rp;
      this.cars = rp;
      this.tempcars = rp;
      this.items = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cars.length; i++) {
        this.items.push({ label: this.cars[i].name, value: this.cars[i].name });
      }
      this.cars = this.items;
    });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }


  createUserChartFormGroup() {

    return this.fb.group({
      id: [0],
      fullName: ['', [Validators.required]],
      birthDay: [null],
      email: ['', [Validators.email]],
      password: [null],
      passwordCF: [''],
      address: [null],
      phoneNumber: [''],
      status: [''],
      gender: [''],
      // skills: this.buildSkills(),
      role: [''],
    });
  }

  // buildSkills() {
  //   const arr = this.user.skills.map(s => {
  //     return this.fb.control(s.selected);
  //     // return this.fb.group({
  //     //   selected: [s.selected],
  //     //   id: [s.id]
  //     // }
  //   });
  //   return this.fb.array(arr);
  // }


}
