import { Component, OnInit, Injector } from '@angular/core';
import { ProductView } from '../_shared/models/product/product-view.model';
import { ProductCategory } from '../../coreapp/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from '../../coreapp/app.consts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedListingComponentBase, PagedRequestDto } from '../../coreapp/paged-listing-component-base';
import { UserService } from '../_shared/services/user.service';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleModel } from '../_shared/models/role/role.model';
import { RoleService } from '../_shared/services/role.service';
class PagedProductsRequestDto extends PagedRequestDto {
  keyWord: string;
}
@Component({
  selector: 'xb-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent extends PagedListingComponentBase<ProductView> implements OnInit {
  listRole: RoleModel[];
  categories: any;
  loadingIndicator = true;
  keywords = '';
  reorderable = true;
  selected = [];
  productTitle = '';
  serviceTitle = '';
  ColumnMode = ColumnMode;
  ProductCategory = ProductCategory;
  SelectionType = SelectionType;
  productKey = {
    productKeyword: '',
  };

  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private userService: UserService,
    private roleService: RoleService) {
    super(injector);
  }

  protected list(
    request: PagedProductsRequestDto,
    pageNumber: number,
    finishedCallback: () => void,
  ): void {
    request.keyWord = this.keywords;
    this.loadingIndicator = true;
    this.getAllRole();
  }
  getAllRole() {
    const request = {
      keyWord: this.keywords.toLocaleLowerCase(),
    };
    this.roleService
      .getAllRole(request)
      .pipe(
      )
      .subscribe(i => {
        this.loadingIndicator = false;
        this.listRole = i;
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
      this.roleService.deleteRole(requestDl).subscribe((rs: any) => {
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
    const title = 'Create role';
    createOrEditProductDialog = this.modalService.open(CreateRoleComponent, AppConsts.modalOptionsSmallSize);
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
    createOrEditProductDialog = this.modalService.open(CreateRoleComponent, AppConsts.modalOptionsSmallSize);
    createOrEditProductDialog.componentInstance.edit = true;
    createOrEditProductDialog.componentInstance.id = event !== undefined ? event.row.id : event;
    const title = 'Edit user';
    createOrEditProductDialog.componentInstance.title = title;
    createOrEditProductDialog.result.then(result => {
      if (result) {
        this.refresh();
      }
    });
  }
}
