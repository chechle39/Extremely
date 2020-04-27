import { Component, OnInit, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntrypatternModalComponent } from './entrypattern-modal/entrypattern-modal.component';
import { AppConsts } from '../../coreapp/app.consts';
import { AppComponentBase } from '../../coreapp/app-base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'xb-entrypattern',
  templateUrl: './entrypattern.component.html',
  styleUrls: ['./entrypattern.component.scss'],
})
export class EntrypatternComponent extends AppComponentBase implements OnInit {
  constructor(
    private modalService: NgbModal,
    injector: Injector,
    private router: Router,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.showModal();
  }

  private showModal() {
    let modalDialog;
    this.modalService.dismissAll();
    modalDialog = this.modalService.open(EntrypatternModalComponent, AppConsts.modalOptionMediumSize);

    modalDialog.result.then(result => {
      this.router.navigate([`/pages`]);
    },
    reason => {
      this.router.navigate([`/pages`]);
    });
  }

}
