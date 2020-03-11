import { Component, Injector } from '@angular/core';
import { ProductView } from '../_shared/models/product/product-view.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { UserService } from '../_shared/services/user.service';
import { UserViewModel } from '../_shared/models/user/userview.model';
import { CreateUserComponent } from './create-user/create-user.component';
import { RoleModel } from '../_shared/models/role/role.model';
import { CommonService } from '../../shared/service/common.service';
import { AuthenticationService } from '../../coreapp/services/authentication.service';
import { Router } from '@angular/router';
class PagedProductsRequestDto extends PagedRequestDto {
  keyWord: string;
}
@Component({
  selector: 'xb-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends PagedListingComponentBase<ProductView> {
  userViews: UserViewModel[];
  listRole: RoleModel[];
  loadingIndicator = true;
  keywords = '';
  reorderable = true;
  selected = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private commonService: CommonService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService) {
    super(injector);
    if (this.authenticationService.checkAccess('User') === false) {
      this.router.navigate([`/auth/login`]);
    }
  }


  protected list(
    request: PagedProductsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    request.keyWord = this.keywords;
    this.loadingIndicator = true;
    this.getAllUser();
  }
  getAllUser() {
    const request = {
      keyWord: this.keywords.toLocaleLowerCase(),
    };
    this.userService
      .getAllUser(request)
      .pipe(
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.userViews = i;
      }, (er) => {
        this.commonService.messeage(er.status);
      });
  }

  edit(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select a item from the list?');
      return;
    }
    if (this.selected.length > 1) {
      this.message.warning('Only one item selected to edit?');
      return;
    }
    this.editById(this.selected[0].id);
    this.selected = [];
  }
  delete(): void {
    if (this.selected.length === 0) {
      this.message.warning('Please select an item from the list?');
      return;
    }
    const requestDl = [];
    this.message.confirm('Do you want to delete users ?', 'Are you sure ?', () => {
      this.selected.forEach(element => {
        const id = element.id;
        requestDl.push({ id });
      });
      this.userService.deleteUser(requestDl).subscribe((rs: any) => {
        this.notify.success('Successfully Deleted');
        this.refresh();
      });
      this.selected = [];
    });
  }
  getRowHeight(row) {
    return row.height;
  }
  createUser(): void {
     this.showCreateUserDialog();
  }
  showCreateUserDialog(): void {
    let createOrEditProductDialog;
    const title = 'Create user';
    createOrEditProductDialog = this.modalService.open(CreateUserComponent, AppConsts.modalOptionsSmallSize);
    createOrEditProductDialog.componentInstance.title = title;
    createOrEditProductDialog.componentInstance.edit = false;

    createOrEditProductDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });

  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // If you are using (activated) event, you will get event, row, rowElement, type
    if (event.type === 'click') {
      if (event.cellIndex > 0) {
        event.cellElement.blur();
        this.editById(event);
      }
    }
  }

  private editById(event: any) {
    let createOrEditProductDialog;
    createOrEditProductDialog = this.modalService.open(CreateUserComponent, AppConsts.modalOptionsSmallSize);
    createOrEditProductDialog.componentInstance.edit = true;
    createOrEditProductDialog.componentInstance.id = event.row !== undefined ? event.row.id : event;
    const title = 'Edit user';
    createOrEditProductDialog.componentInstance.title = title;
    createOrEditProductDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });
  }
}
