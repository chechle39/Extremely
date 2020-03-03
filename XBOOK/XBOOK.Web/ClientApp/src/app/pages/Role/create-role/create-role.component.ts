import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '../../_shared/models/product/product-view.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { ProductService } from '../../_shared/services/product.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RoleService } from '../../_shared/services/role.service';
import { RoleModel } from '../../_shared/models/role/role.model';
import { SelectItem } from 'primeng/components/common/selectitem';
import { UserService } from '../../_shared/services/user.service';
import { UserViewModel } from '../../_shared/models/user/userview.model';
import { AppConsts } from '../../../coreapp/app.consts';
import * as moment from 'moment';

@Component({
  selector: 'xb-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent extends AppComponentBase implements OnInit {
  claims = {
    skills: [
      { id: 'XBOOk.Role.View', selected: false, name: 'View' },
      { id: 'XBOOk.Role.Edit', selected: false, name: 'Edit' },
    ],
  };
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
  public roleForm: FormGroup;
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

  ngOnInit() {
    this.roleForm = this.createUserChartFormGroup();
    if (this.edit === true) {
      this.userService.getUserById(this.id).subscribe(rp => {
        const issueDate = moment(rp.birthDay).format(AppConsts.defaultDateFormat);
        const issueDateSplit = issueDate.split('/');
        const issueDatePicker = {
          year: Number(issueDateSplit[2]),
          month: Number(issueDateSplit[1]), day: Number(issueDateSplit[0]),
        };
        this.roleForm.patchValue({
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
  }
  saveRole(submittedForm: FormGroup): void {
    const arrclaim = [];
    const formValue = Object.assign({}, submittedForm.controls.roleClaims, {
      roleClaims: submittedForm.controls.roleClaims.value.map((selected, i) => {
        return {
          id: this.claims.skills[i].id,
          name: this.claims.skills[i].name,
          selected,
       };
      }),
    });
    const fillter = formValue.roleClaims.filter(x => x.selected === true);
    for (let i = 0; i < fillter.length; i++) {
      const claim = {
        name: fillter[i].id,
        type: fillter[i].id,
      };
      arrclaim.push(claim);
    }
    const requestCreate = {
      name: submittedForm.value.name,
      description: submittedForm.value.description,
      requestData: arrclaim,
    };
    this.roleService.createRole(requestCreate).subscribe(rp => {
      this.notify.success('saved successfully');
      this.close(true);
    });
    // if (!this.edit) {

    // } else {
    //   this.userService.updateUser(request).subscribe(rp => {
    //     this.notify.success('update successfully');
    //     this.close(true);
    //   });
    // }

  }

  close(result: any): void {
    this.activeModal.close(result);
  }


  createUserChartFormGroup() {

    return this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      description: [null],
      roleClaims: this.buildSkills(),
    });
  }
  get skills(): FormArray {
    return this.roleForm.get('roleClaims') as FormArray;
  }
  buildSkills() {
    const arr = this.claims.skills.map(s => {
      return this.fb.control(s.selected);
      // return this.fb.group({
      //   selected: [s.selected],
      //   id: [s.id],
      // });
    });
    return this.fb.array(arr);
  }


}
