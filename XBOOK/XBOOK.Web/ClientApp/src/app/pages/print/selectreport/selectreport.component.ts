import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyMethod } from '../../_shared/models/invoice/currency-method.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '../../../coreapp/app-base.component';
import { AcountNumberMethod } from '../../_shared/models/invoice/accountnumber-method.model';
import { PrintService } from '../../_shared/services/print.service';
import { SelectItem } from 'primeng/components/common/selectitem';
@Component({
  selector: 'xb-selectreport',
  templateUrl: './selectreport.component.html',
  styleUrls: ['./selectreport.component.scss']
})
export class SelectReportComponent extends AppComponentBase implements OnInit {
  @Input() accChart;
  invokeAction = '/DXXRDV';
  cars: any[];
  tempcars: AcountNumberMethod[];
  selectedCars1: string[] = [];

  selectedCars2: string[] = [];

  items: SelectItem[];

  item: string;
  public genLedForm: FormGroup;
  isSelectedAccount = false;
  isSelectedCrspAccount = false;
  genLedMethods: any[] = [];
  currencyMethod = [
    new CurrencyMethod(1, 'VND'),
    new CurrencyMethod(2, 'USD'),
  ];
  acountNumberMethod: AcountNumberMethod[];
  fromDate: any;
  firstDate: any;
  endDate: string;
  case6: any;
  constructor(
    public fb: FormBuilder,
    injector: Injector,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public printService: PrintService) {
    super(injector);
    this.genLedForm = this.createGenLedFormGroup();
  }

  ngOnInit() {
    this.printService.ReadNameReport().subscribe(result => {
      this.genLedMethods = result;
    });
  }

  createGenLedFormGroup() {
    return this.fb.group({
      genLedMethods: [null],
    });
  }



  close(e: boolean): void {
    if (e === true) {
      const genledSearch = {
        case: this.genLedForm.value.genLedMethods
      };
      this.activeModal.close(genledSearch);
      this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }
}
