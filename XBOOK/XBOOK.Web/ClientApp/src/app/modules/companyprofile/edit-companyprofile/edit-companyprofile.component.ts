import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@core/app-base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CompanyprofileView } from '@modules/_shared/models/companyprofile/companyprofile-view.model';
import { CompanyService } from '@modules/_shared/services/company-profile.service';

@Component({
  selector: 'xb-edit-companyprofile',
  templateUrl: './edit-companyprofile.component.html'
})
export class EditCompanyprofileComponent extends AppComponentBase implements OnInit {

  @Input() title;
  @Input() id: number;
  companyprofileView: CompanyprofileView = new CompanyprofileView();
  saving = false;
  constructor(
    injector: Injector,
    public activeModal: NgbActiveModal,
    private companyProfileService: CompanyService) { super(injector); }

  ngOnInit() {
    this.companyProfileService.getProfile(this.id).subscribe(result => {
      this.companyprofileView = result;
    });
  }
  save(): void {
    this.companyProfileService
      .updateProfile(this.companyprofileView)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Update Successfully');
        this.close(true);
      });
  }
  close(result: any): void {
    this.activeModal.close(result);
  }
}
