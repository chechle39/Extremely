import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxService } from '@modules/_shared/services/tax.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-add-tax',
  templateUrl: './add-tax.component.html'
})
export class AddTaxComponent implements OnInit {
  public taxForm: FormGroup;
  addList: any;
  taxData: any;
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private taxService: TaxService) { }
  @Input() taxsList: any[];
  @Input() taxsObj: any;
  taxListData: any;
  ngOnInit() {
    this.taxForm = this.createForm();
    this.taxService.getAll().pipe(finalize(() => {
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
    })

  }
  private createForm() {
    return this.fb.group({
      allLine: [null],
      taxs: this.fb.array([this.createTaxLine()])
    });
  }
  private createTaxLine(): FormGroup {
    return this.fb.group({
      taxRate: [null, [Validators.required, Validators.min(1), Validators.max(100), Validators.maxLength(3)]],
      taxName: [null, Validators.required],
      isChecked: [null],
      isAdd: [null]
    });
  }
  get taxs(): FormArray {
    return this.taxForm.get('taxs') as FormArray;
  }

  addTax(): void {
    this.taxs.push(this.createTaxLine());
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
      if (this.addList.length > 0)
        this.taxService.addTax(this.addList).subscribe(rs => {

        });
    }
    this.close(this.taxForm.value);
  }
  removeTax() {
    /// this.arrayItems.pop();
    // this.demoArray.removeAt(this.demoArray.length - 1);
  }
  close(result: any): void {
    this.activeModal.close(result);
  }

  getDataList(taxData: any) {
    const data = [];
    const list = this.taxsList !== undefined ? this.taxsList : taxData;
    for (let i = 0; i < list.length; i++) {
      if (list[i].taxRate === this.taxsObj) {
        const checked = {
          id: list[i].id,
          taxName: list[i].taxName,
          taxRate: list[i].taxRate,
          isChecked: true,
          isAdd: true,
        }
        data.push(checked);
      } else {
        const checked = {
          id: list[i].id,
          taxName: list[i].taxName,
          taxRate: list[i].taxRate,
          isChecked: false,
          isAdd: false,
        }
        data.push(checked);
      }
    }
    return this.taxListData = data;
  }
}
