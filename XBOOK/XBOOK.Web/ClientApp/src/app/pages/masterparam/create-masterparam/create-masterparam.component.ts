import { Component, OnInit, Input, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { CompanyprofileView } from '../../_shared/models/companyprofile/companyprofile-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../../_shared/services/company-profile.service';
import { finalize } from 'rxjs/operators';
import { MasterParamService } from '../../_shared/services/masterparam.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
// @Component({
//   selector: 'xb-create-masterparam',
//   templateUrl: './create-masterparam.component.html',
//   styleUrls: ['./create-masterparam.component.scss']
// })
// export class CreateMasterParamComponent extends AppComponentBase implements OnInit {
//   saving: false;
//   items: SelectItem[];
//   public taxForm: FormGroup;
//   addList: any;
//   mess: any;
//   selectedDevice: any;
//   taxData: any[];
//   Listtemp: any[];
//   SelectedData: any[];
//   paramType: any[];
//   isCheckDate = true;
//   companyprofileView: CompanyprofileView = new CompanyprofileView();
//   constructor(
//     injector: Injector,
//     private fb: FormBuilder,
//     public activeModal: NgbActiveModal,
//     private companyProfileService: CompanyService,
//     private masterParamService: MasterParamService,
//   ) {
//     super(injector);
//   }
//   @Input() taxsList: any[];
//   @Input() taxsObj: any;
//   @ViewChild('paramTypeSelected', { static: true }) paramTypeSelected: ElementRef;

//   taxListData: any;
//   ngOnInit() {
//     this.getTax();
//     this.taxForm = this.createForm();
//   }
//   private getTax() {
//     this.masterParamService.getAll().pipe(finalize(() => {
//     })).subscribe(rs => {
//       this.SelectedData = rs;
//       this.items = [];
//       this.items.push({ value: this.SelectedData[0].paramType });
//       // tslint:disable-next-line:prefer-for-of
//       for (let i = 1; i < this.SelectedData.length; i++) {
//         if (this.SelectedData[i].paramType !== this.SelectedData[i - 1].paramType) {
//           this.items.push({ value: this.SelectedData[i].paramType });
//         }
//       }
//       this.paramType = this.items;
//     });
//   }
//   get taxs(): FormArray {
//     return this.taxForm.get('taxs') as FormArray;
//   }

//   addTax(): void {
//     if (this.paramTypeSelected.nativeElement.value !== 'Choose a value Master Param') {
//       this.taxs.push(this.createTaxLine());
//     } else {
//       this.message.warning('Chọn một Master Param');
//     }
//   }
//   private createForm() {
//     return this.fb.group({
//       allLine: [null],
//       selectedDevice: [null],
//       taxs: this.fb.array([this.createTaxLine()])
//     });
//   }
//   private createTaxLine(): FormGroup {
//     return this.fb.group({
//       paramType: this.paramTypeSelected.nativeElement.value,
//       key: [null, [Validators.required, Validators.min(1), Validators.max(100), Validators.maxLength(200)]],
//       name: [null],
//       description: [null],
//       isAdd: [null]
//     });
//   }
//   getDataList(taxData: any) {
//     const data = [];
//     const list = taxData;
//     // tslint:disable-next-line:prefer-for-of
//     for (let i = 0; i < list.length; i++) {
//       if (list[i].taxRate === this.taxsObj) {
//         const checked = {
//           key: list[i].key,
//           name: list[i].name,
//           description: list[i].name,
//           isAdd: true,
//         };
//         data.push(checked);
//       } else {
//         const checked = {
//           key: list[i].key,
//           name: list[i].name,
//           description: list[i].name,
//           isAdd: false,
//         };
//         data.push(checked);
//       }
//     }
//     return this.taxListData = data;

//   }
//   applyTax(submittedForm: FormGroup) {
//     const addListData = [];
//     if (this.taxForm.value.taxs.length > this.taxListData.length) {
//       this.taxForm.value.taxs.forEach(element => {
//         if (element.isAdd === null) {
//           addListData.push(element);
//         }
//       });
//       this.addList = addListData;
//       if (this.addList.length > 0) {
//         this.masterParamService.addTax(this.addList).subscribe(rs => {
//           this.notify.success('Successfully Save');
//           // tslint:disable-next-line:no-shadowed-variable
//           this.onload();
//           return;
//         });
//       }
//     } else {
//       this.taxForm.value.taxs.forEach(element => {
//         addListData.push(element);
//       });
//       this.addList = addListData;
//       if (this.addList.length > 0) {
//         this.masterParamService.updateMaster(this.addList).subscribe(rs => {
//           this.notify.success('Successfully Update');
//           // tslint:disable-next-line:no-shadowed-variable
//           this.onload();
//           return;
//         });
//       }
//     }

//   }
//   close(result: any): void {
//     this.activeModal.close(result);
//   }
//   delete(paramType: string, key: string, name: string): void {
//     const a = this.paramTypeSelected.nativeElement.value;
//     if (a !== 'Choose a value Master Param') {
//       this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
//       })).subscribe(rs => {
//         this.Listtemp = rs;
//         if (this.Listtemp.length > 1 || key === null || key === undefined) {
//           const request = [{
//             nameDelete: name,
//             keydelete: key,
//             paramTypedelete: paramType
//           }];
//           if (key !== null || key !== undefined ) {
//             this.masterParamService.deleteMaster(request).subscribe(rp => {
//               this.onload();
//               this.notify.success('Successfully Deleted');
//             });
//           }
//         } else {
//           this.message.warning('Không thể xóa Master Param cuối cùng');
//         }
//       });
//     } else {
//       this.message.warning('Chọn một Master Param');
//     }
//   }

//   onload() {
//     // tslint:disable-next-line:no-shadowed-variable
//     this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).subscribe(rs => {
//       this.taxData = rs;
//       this.getDataList(rs);
//       if (this.taxListData.length > 0) {
//         this.taxs.controls.splice(0);
//         const taxFormsArray = this.taxs;
//         this.taxListData.forEach(element => {
//           taxFormsArray.push(this.createTaxLine());
//         });
//         this.taxForm.controls.taxs.patchValue(this.taxListData);
//       }
//     });
//   }


//   onChange(e: any) {
//     this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
//     })).subscribe(rs => {
//       this.taxData = rs;
//       this.getDataList(rs);
//       if (this.taxListData.length > 0) {
//         this.taxs.controls.splice(0);
//         const taxFormsArray = this.taxs;
//         this.taxListData.forEach(element => {
//           taxFormsArray.push(this.createTaxLine());
//         });
//         this.taxForm.controls.taxs.patchValue(this.taxListData);
//       }
//     });
//   }
// }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'xb-create-masterparam',
  templateUrl: './create-masterparam.component.html',
  styleUrls: ['./create-masterparam.component.scss'],
})
export class CreateMasterParamComponent extends AppComponentBase implements OnInit {
  saving: false;
  items: SelectItem[];
  public taxForm: FormGroup;
  addList: any;
  mess: any;
  selectedDevice: any;
  taxData: any[];
  Listtemp: any[];
  SelectedData: any[];
  paramType: any[];
  companyprofileView: CompanyprofileView = new CompanyprofileView();
  submitted: boolean;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private companyProfileService: CompanyService,
    private masterParamService: MasterParamService,
  ) {
    super(injector);
  }
  @Input() taxsList: any[];
  @Input() taxsObj: any;
  @ViewChild('paramTypeSelected', { static: true }) paramTypeSelected: ElementRef;

  taxListData: any;
  ngOnInit() {
    this.getTax();
    this.taxForm = this.createForm();
  }
  private getTax() {
    this.masterParamService.getAll().pipe(finalize(() => {
    })).subscribe(rs => {
      this.SelectedData = rs;
      this.items = [];
      this.items.push({ value: this.SelectedData[0].paramType });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 1; i < this.SelectedData.length; i++) {
        if (this.SelectedData[i].paramType !== this.SelectedData[i - 1].paramType) {
          this.items.push({ value: this.SelectedData[i].paramType });
        }
      }
      this.paramType = this.items;
      // this.getDataList(rs);
      // if (this.taxListData.length > 0) {
      //   this.taxs.controls.splice(0);
      //   const taxFormsArray = this.taxs;
      //   this.taxListData.forEach(element => {
      //     taxFormsArray.push(this.createTaxLine());
      //   });
      // //  this.taxForm.controls.taxs.patchValue(this.taxListData);
      // }
    });
  }
  get taxs(): FormArray {
    return this.taxForm.get('taxs') as FormArray;
  }

  addTax(): void {
    if (this.paramTypeSelected.nativeElement.value !== 'Choose a value Master Param') {
      this.taxs.push(this.createTaxLine());
    } else {
      this.message.warning('Please select a item Master Param');
    }
  }
  private createForm() {
    return this.fb.group({
      allLine: [null],
      selectedDevice: [null],
      taxs: this.fb.array([this.createTaxLine()]),
    });
  }
  private createTaxLine(): FormGroup {
    return this.fb.group({
      paramType: this.paramTypeSelected.nativeElement.value,
      key: [null, [Validators.required, Validators.min(1), Validators.max(100), Validators.maxLength(200)]],
      name: [null],
      description: [null],
      isAdd: [null],
    });
  }
  getDataList(taxData: any) {
    const data = [];
    const list = taxData;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < list.length; i++) {
      if (list[i].taxRate === this.taxsObj) {
        const checked = {
          key: list[i].key,
          name: list[i].name,
          description: list[i].name,
          isAdd: true,
        };
        data.push(checked);
      } else {
        const checked = {
          key: list[i].key,
          name: list[i].name,
          description: list[i].name,
          isAdd: false,
        };
        data.push(checked);
      }
    }
    return this.taxListData = data;

  }
  applyTax() {
    // if (this.paramTypeSelected.nativeElement.value === 'Choose a value Master Param') {
    //   this.message.warning('Please select a item Master Param');
    //   return false;
    // }
    this.submitted = true;

    // stop here if form is invalid
    if (this.taxForm.invalid) {
        return;
    }

    // display form values on success
 //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.taxForm.value, null, 4));
   // tslint:disable-next-line:one-line
   else {
    const addListData = [];
    if (this.taxForm.value.taxs.length > this.taxListData.length) {
      this.taxForm.value.taxs.forEach(element => {
        if (element.isAdd === null) {
          addListData.push(element);
        }
      });
      this.addList = addListData;
      if (this.addList.length > 0) {
        this.masterParamService.addTax(this.addList).subscribe(rs => {
          this.notify.success('Successfully Save');
          // tslint:disable-next-line:no-shadowed-variable
          this.onload();
          return;
        }, (er) => {
        //  this.message.warning('Key này đã tồn tại! Vui lòng kiểm tra lại!');
        });

      }
    } else {
      this.taxForm.value.taxs.forEach(element => {
        addListData.push(element);
      });
      this.addList = addListData;
      if (this.addList.length > 0) {
        this.masterParamService.updateMaster(this.addList).subscribe(rs => {
          this.notify.success('Successfully Update');
          // tslint:disable-next-line:no-shadowed-variable
          this.onload();
          return;
        }, (er) => {
         // this.message.warning('Key này đã tồn tại! Vui lòng kiểm tra lại!');
        });
      }
    }
   }

  }
  close(result: any): void {
    this.activeModal.close(result);
  }
  delete(paramType: string, key: string, name: string): void {
    const a = this.paramTypeSelected.nativeElement.value;
    if (a !== 'Choose a value Master Param') {
      this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
      })).subscribe(rs => {
        this.Listtemp = rs;
        if (this.Listtemp.length > 1 || key === null || key === undefined) {
          const request = [{
            nameDelete: name,
            keydelete: key,
            paramTypedelete: paramType,
          }];
          if (key !== null || key !== undefined) {
            this.masterParamService.deleteMaster(request).subscribe(rp => {
              this.onload();
              this.notify.success('Successfully Deleted');
            });
          }

        } else {
          this.message.warning('Only one left  item Master Param');
        }

      });
    } else {
      this.message.warning('Please select a item Master Param');
    }
  }

  onload() {
    // tslint:disable-next-line:no-shadowed-variable
    this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).subscribe(rs => {
      this.taxData = rs;
      this.getDataList(rs);
      if (this.taxListData.length > 0) {
        this.taxs.controls.splice(0);
        const taxFormsArray = this.taxs;
        this.taxListData.forEach(element => {
          taxFormsArray.push(this.createTaxLine());
        });
        this.taxForm.controls.taxs.patchValue(this.taxListData);
      }
    });
  }


  onChange(e: any) {
    this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
    })).subscribe(rs => {
      this.taxData = rs;
      this.getDataList(rs);
      if (this.taxListData.length > 0) {
        this.taxs.controls.splice(0);
        const taxFormsArray = this.taxs;
        this.taxListData.forEach(element => {
          taxFormsArray.push(this.createTaxLine());
        });
        this.taxForm.controls.taxs.patchValue(this.taxListData);
      }
    });
  }
  get f() { return this.taxForm.controls; }


}
