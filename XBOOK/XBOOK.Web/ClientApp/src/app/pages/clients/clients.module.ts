import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NbAlertModule, NbCardModule, NbIconModule, NbPopoverModule, NbSearchModule, NbButtonModule, NbActionsModule, NbSelectModule, NbContextMenuModule, NbSidebarModule } from '@nebular/theme';
import { ClientRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ImportClientComponent } from './import-client/import-client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../_shared/services/client.service';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [ClientsComponent, CreateClientComponent, EditClientComponent, ImportClientComponent],
  imports: [
    NgbModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule
  ],
  providers: [ClientService, CurrencyPipe, DecimalPipe],
  entryComponents: [EditClientComponent, CreateClientComponent, ImportClientComponent]
})
export class ClientsModule { }
