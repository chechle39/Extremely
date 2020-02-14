import { Component, OnInit, Input, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { CompanyprofileView } from '@modules/_shared/models/companyprofile/companyprofile-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { finalize } from 'rxjs/operators';
import { MasterParamService } from '@modules/_shared/services/masterparam.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
@Component({
  selector: 'xb-create-masterparam',
  templateUrl: './create-masterparam.component.html',
  styleUrls: ['./create-masterparam.component.scss']
})
export class CreateMasterParamComponent extends AppComponentBase implements OnInit {
  saving: false;
  items: SelectItem[];
  public taxForm: FormGroup;
  addList: any;
  selectedDevice: any;
  taxData: any[];
  Listtemp: any[];
  paramType: any[];
  companyprofileView: CompanyprofileView = new CompanyprofileView();
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
      this.taxData = rs;
      this.items = [];
      this.items.push({ value: this.taxData[0].paramType });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 1; i < this.taxData.length; i++) {
        if (this.taxData[i].paramType !== this.taxData[i - 1].paramType) {
          this.items.push({ value: this.taxData[i].paramType });
        }
      }
      this.paramType = this.items;
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
  get taxs(): FormArray {
    return this.taxForm.get('taxs') as FormArray;
  }

  addTax(): void {
    if (this.paramTypeSelected.nativeElement.value !== 'Choose a value Param Type') {
      this.taxs.push(this.createTaxLine());
    } else {
      this.message.warning('Please select a item Param Type');
    }
  }
  private createForm() {
    return this.fb.group({
      allLine: [null],
      selectedDevice: [null],
      taxs: this.fb.array([this.createTaxLine()])
    });
  }
  private createTaxLine(): FormGroup {
    return this.fb.group({
      paramType: this.paramTypeSelected.nativeElement.value,
      key: [null, [Validators.required, Validators.min(1), Validators.max(100), Validators.maxLength(3)]],
      name: [null],
      description: [null],
      isAdd: [null]
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
        });
      }
    } else {
      this.message.warning('Please review data');
    }
    this.close(this.taxForm.value);
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
  delete(paramType: string, key: string, name: string): void {
    const a = this.paramTypeSelected.nativeElement.value;
    if (a !== 'Choose a value Param Type') {
      this.masterParamService.getProfile(this.paramTypeSelected.nativeElement.value).pipe(finalize(() => {
      })).subscribe(rs => {
        this.Listtemp = rs;
        if (this.Listtemp.length > 1) {
          const request = [{
            nameDelete: name,
            keydelete: key,
            paramTypedelete: paramType
          }];
          this.masterParamService.deleteMaster(request).subscribe(rp => {
            this.getTax();
            this.notify.success('Successfully Deleted');
          });
        } else {
          this.message.warning('Only one left  item Param Type');
        }

      });
    } else {
      this.message.warning('Please select a item Param Type');
    }
  }
  onChange(e: any) {
    const a = this.paramTypeSelected.nativeElement.value;
    if (a === 'Choose a value Param Type') {
      this.masterParamService.getAll().subscribe(rs => {
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
    } else {
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
  }
}
