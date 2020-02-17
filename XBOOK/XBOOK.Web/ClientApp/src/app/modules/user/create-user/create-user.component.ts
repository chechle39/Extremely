import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { AppComponentBase } from '@core/app-base.component';
import { ProductService } from '@modules/_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RoleService } from '@modules/_shared/services/role.service';
import { RoleModel } from '@modules/_shared/models/role/role.model';
import { SelectItem } from 'primeng/components/common/selectitem';
import { UserService } from '@modules/_shared/services/user.service';
import { UserViewModel } from '@modules/_shared/models/user/userview.model';

@Component({
  selector: 'xb-create-user',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent extends AppComponentBase implements OnInit {
  // user = {
  //   skills: [
  //     { name: 'Admin', selected: true, id: 12 },
  //     { name: 'Member', selected: false, id: 2 },
  //   ]
  // };
  @Input() title;
  @Input() categoryId;
  @Input() listCategory;
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
    // console.log(this.userForm.get('skills'));
    this.getRole();
  }
  saveUser(submittedForm: FormGroup): void {
    const request = {
      address: submittedForm.controls.address.value,
      avatar: '',
      birthDay: [this.userForm.value.birthDay.year,
        this.userForm.value.birthDay.month,
        this.userForm.value.birthDay.day].join('-') === '--' ? '' : [this.userForm.value.birthDay.year,
          this.userForm.value.birthDay.month, this.userForm.value.birthDay.day].join('-'),
      email: submittedForm.controls.email.value,
      fullName: submittedForm.controls.fullName.value,
      gender: submittedForm.controls.gender.value,
      id: 0,
      password: submittedForm.controls.password.value,
      phoneNumber: submittedForm.controls.phoneNumber.value,
      roles: submittedForm.controls.role.value,
    } as UserViewModel;
    this.userService.createUser(request).subscribe(rp => {
      console.log(rp);
    });
  }

  getRole() {
    this.roleService.getAllRole().pipe().subscribe((rp: any) => {
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
      fullName: ['', [Validators.required]],
      birthDay: [null],
      email: [''],
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
