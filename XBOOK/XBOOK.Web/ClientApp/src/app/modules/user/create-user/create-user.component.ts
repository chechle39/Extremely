import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductView } from '@modules/_shared/models/product/product-view.model';
import { AppComponentBase } from '@core/app-base.component';
import { ProductService } from '@modules/_shared/services/product.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'xb-create-user',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent extends AppComponentBase implements OnInit {
  user = {
    skills: [
      { name: 'JS',  selected: true, id: 12 },
      { name: 'CSS',  selected: false, id: 2 },
    ]
  };
  @Input() title;
  @Input() categoryId;
  @Input() listCategory;
  saving: false;
  categories: any;
  statusCategory: any;
  product: ProductView = new ProductView();
  public userForm: FormGroup;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    public productService: ProductService) {
    super(injector);
  }
  get skills(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }
  ngOnInit() {
    this.userForm = this.createUserChartFormGroup();
    console.log(this.userForm.get('skills'));
    this.categories = this.listCategory;
    this.statusCategory = this.categoryId;
  }
  saveUser(e): void {

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
      userName: [''],
      address: [null],
      phoneNumber: [''],
      status: [''],
      gender: [''],
      skills: this.buildSkills()
    });
  }

  buildSkills() {
    const arr = this.user.skills.map(s => {
      return this.fb.control(s.selected);
      // return this.fb.group({
      //   selected: [s.selected],
      //   id: [s.id]
      // }
    });
    return this.fb.array(arr);
  }


}
