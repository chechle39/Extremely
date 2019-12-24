import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClientView } from '@modules/_shared/models/client/client-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '@core/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '@core/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { SearchgenledComponent } from './searchgenledgroup/searchgenled.component';
import { GenLedGroupService } from '@modules/_shared/services/genledgroup.service';
import { AccountChartService } from '@modules/_shared/services/accountchart.service';
import { SelectItem } from 'primeng/components/common/selectitem';
class PagedClientsRequestDto extends PagedRequestDto {
  clientKeyword: string;
}
@Component({
  selector: 'xb-genled',
  templateUrl: './genledgroup.component.html',
  styleUrls: ['./genledgroup.component.scss']
})
export class GenledgroupComponent extends PagedListingComponentBase<ClientView> {
  exportCSV: any;
  protected delete(id: number): void {
    throw new Error("Method not implemented.");
  }
  fromDate: any;
  firstDate: any;
  endDate1: string;
  sum:any;
  tempaccount:any;
  items: SelectItem[];
  sumtemp:any;
  case: any;  
  genViews: any;
  genViewsTemp: any;
  startDay: any;
  endDay: any;
  keyspace: any;
  loadingIndicator = false;
  keyword = '';
  reorderable = true;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  clientKeyword = '';
  constructor(
    injector: Injector,
    public accountChartService: AccountChartService,
    private genLedService: GenLedGroupService,
    private modalService: NgbModal,
    private router: Router) {
    super(injector);
  }
  
  protected list(
    
    request: PagedClientsRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    var date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-GB');
    this.endDate1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-GB');
    const genledSearch = {
      startDate: this.firstDate === undefined ? null : this.firstDate,
        endDate: this.endDate1 === undefined ? null : this.endDate1,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null
    }  
    this.accountChartService.searchAcc().subscribe(rp => {       
      this.tempaccount=rp;          
    })
    this.genLedService
      .searchGen(genledSearch)
      .pipe(
        // debounceTime(500),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.genViews = i;       
        const data = [];   
       
      this.genViewsTemp = data;        
      });   
  }
//  acountname(): void{
//   this.accountChartService.searchAcc().subscribe(rp => {       
//     this.tempaccount=rp;
//     this.items = [];
//     for (let i = 0; i < this.tempaccount.length; i++) {
//         this.items.push({label:this.tempaccount[i].accountName, value: this.tempaccount[i].accountNumber});
//     }
//     this.tempaccount = this.tempaccount ;
   
//   })
//  }

 
  SearchGenLed(): void {

    const dialog = this.modalService.open(SearchgenledComponent, AppConsts.modalOptionsCustomSize);
    dialog.result.then(result => {
      if (result) {
        const genledSearch = {
          startDate: result.startDate,
          endDate: result.endDate,
          isaccount: result.isaccount,
          isAccountReciprocal: result.accountReciprocal,
          money: result.money,
          accNumber: result.accNumber ,      
        }
        this.exportCSV = result;
        this.genLedService.searchGen(genledSearch).subscribe(rp => {
          this.genViews = rp;
           this.case = result.case;         
          this.startDay = result.startDate;
          this.endDay = result.endDate;
          this.keyspace = ' - '
        })

      }
    });
  }


  getRowHeight(row) {
    return row.height;
  }

  exportData() {
    const genledSearch = {
      startDate: null,
      endDate: null,
      isaccount: false,
      isAccountReciprocal: false,
      money: null,
      accNumber: null
    }
    this.genLedService.exportCSV(this.exportCSV === undefined ? genledSearch : this.exportCSV)

  }
}
