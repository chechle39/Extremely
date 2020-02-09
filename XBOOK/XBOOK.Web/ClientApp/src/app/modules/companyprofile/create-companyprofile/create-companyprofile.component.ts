import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { CompanyprofileView } from '@modules/_shared/models/companyprofile/companyprofile-view.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '@modules/_shared/services/company-profile.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'xb-create-companyprofile',
  templateUrl: './create-companyprofile.component.html'
})
export class CreateCompanyprofileComponent extends AppComponentBase implements OnInit {
  saving: false;
  companyprofileView: CompanyprofileView = new CompanyprofileView();
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private companyProfileService: CompanyService) {
    super(injector);
  }

  ngOnInit() {
  }
  save(): void {
    this.companyProfileService
      .createProfile(this.companyprofileView)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Saved Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
