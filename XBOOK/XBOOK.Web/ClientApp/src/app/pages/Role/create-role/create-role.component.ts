import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '../../_shared/models/product/product-view.model';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RoleService } from '../../_shared/services/role.service';
import { RoleModel } from '../../_shared/models/role/role.model';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'xb-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent extends AppComponentBase implements OnInit {
  claims = [];

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
    public fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    // const claims = [
    //   { id: 'XBOOk.Role.View', selected: false, name: 'View' },
    //   { id: 'XBOOk.Role.Edit', selected: false, name: 'Edit' },
    // ];
    // this.claims = claims;
    this.roleForm = this.createRoleFormGroup();
    if (this.edit === true) {
      this.roleService.getRoleById(this.id).subscribe(rp => {
        // let view = false;
        // let edit = false;
        // for (let i = 0; i < rp.roleClaims.length; i++) {
        //   if (rp.roleClaims[i].type === 'XBOOk.Role.View') {
        //     view = true;
        //   }
        //   if (rp.roleClaims[i].type === 'XBOOk.Role.Edit') {
        //     edit = true;
        //   }
        // }
        this.roleForm.patchValue({
          id: rp.id,
          name: rp.name,
          description: rp.description,
         // roleClaims: [view, edit],
        });
        this.selectedCities = rp.roles;
      });
    }
  }
  saveRole(submittedForm: FormGroup): void {
    const arrclaim = [];
    // const formValue = Object.assign({}, submittedForm.controls.roleClaims, {
    //   roleClaims: submittedForm.controls.roleClaims.value.map((selected, i) => {
    //     return {
    //       id: this.claims[i].id,
    //       name: this.claims[i].name,
    //       selected,
    //     };
    //   }),
    // });
    // const fillter = formValue.roleClaims.filter(x => x.selected === true);
    // for (let i = 0; i < fillter.length; i++) {
    //   const claim = {
    //     name: fillter[i].id,
    //     type: fillter[i].id,
    //   };
    //   arrclaim.push(claim);
    // }
    const requestCreate = {
      id: submittedForm.value.id,
      name: submittedForm.value.name,
      description: submittedForm.value.description,
     // requestData: arrclaim,
    };

    if (!this.edit) {
      this.roleService.createRole(requestCreate).subscribe(rp => {
        this.notify.success('saved successfully');
        this.close(true);
      });
    } else {
      this.roleService.updateRole(requestCreate).subscribe(rp => {
        this.notify.success('update successfully');
        this.close(true);
      });
    }

  }

  close(result: any): void {
    this.activeModal.close(result);
  }


  createRoleFormGroup() {

    return this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      description: [null],
     // roleClaims: this.buildSkills(),
    });
  }
  // get skills(): FormArray {
  //   return this.roleForm.get('roleClaims') as FormArray;
  // }
  // buildSkills() {
  //   const arr = this.claims.map(s => {
  //     return this.fb.control(s.selected);
  //   });
  //   return this.fb.array(arr);
  // }


}
