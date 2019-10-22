import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'xb-add-tax',
  templateUrl: './add-tax.component.html'
})
export class AddTaxComponent implements OnInit {
  public taxForm: FormGroup;
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, ) { }
  @Input() taxsList: any[];
  @Input() taxsObj: any;
  taxListData: any;
  ngOnInit() {
    this.getDataList();
    this.taxForm = this.createForm();
    if (this.taxListData.length > 0) {
      this.taxs.controls.splice(0);
      const taxFormsArray = this.taxs;
      this.taxListData.forEach(element => {
        taxFormsArray.push(this.createTaxLine());
      });
      this.taxForm.controls.taxs.patchValue(this.taxListData);
    }
  }
  
  getDataList() {
    const data = [];
    for (let i = 0; i < this.taxsList.length; i++) {
      if (this.taxsList[i].taxRate === this.taxsObj){
        const checked = {
          id: this.taxsList[i].id,
          taxName: this.taxsList[i].taxName,
          taxRate: this.taxsList[i].taxRate,
          isChecked: true,
        }
        data.push(checked);
      }else {
        data.push(this.taxsList[i]);
      }
    }
    return this.taxListData = data;
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
    });
  }
  get taxs(): FormArray {
    return this.taxForm.get('taxs') as FormArray;
  }
  addTax(): void {
    this.taxs.push(this.createTaxLine());
  }
  applyTax() {
    // stop here if form is invalid
    if (this.taxForm.invalid) {
      return;
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

}
