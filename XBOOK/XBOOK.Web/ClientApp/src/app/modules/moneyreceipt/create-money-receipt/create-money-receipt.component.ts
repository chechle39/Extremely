import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@core/app-base.component';
import { PaymentMethod } from '@modules/_shared/models/invoice/payment-method.model';
import { Observable, Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ClientService } from '@modules/_shared/services/client.service';
import { ClientSearchModel } from '@modules/_shared/models/client/client-search.model';

@Component({
  selector: 'xb-create-money-receipt',
  templateUrl: './create-money-receipt.component.html',
  styleUrls: ['./create-money-receipt.component.scss']
})
export class CreateMoneyReceiptComponent extends AppComponentBase implements OnInit {
  @ViewChild('xxx', {
    static: true
  }) xxx: ElementRef;
  paymentMethods = [
    new PaymentMethod(1, 'Cash'),
    new PaymentMethod(2, 'Visa card'),
    new PaymentMethod(3, 'Bank transfer')
  ];
  isCheckFc: boolean;
  focusClient$ = new Subject<string>();
  searchFailed = false;
  clientSelected = new ClientSearchModel();
  clientName: string;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private clientService: ClientService) {
    super(injector);
  }

  ngOnInit() {
  }

  close(result: any): void {
    this.activeModal.close(result);
  }

  searchClient = (text$: Observable<string>) => {
    this.isCheckFc = false;
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const inputFocus$ = this.focusClient$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term =>
        this.clientService.searchClient(this.requestClient(term)).pipe(
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ));
  }

  requestClient(e: any) {
    const clientKey = {
      clientKeyword: e.toLocaleLowerCase(),
    };
    return clientKey;
  }

  selectedItem(item) {
    this.clientSelected = {} as ClientSearchModel;
    this.clientSelected = item.item as ClientSearchModel;
    this.clientName = this.clientSelected.clientName;
  }
}
