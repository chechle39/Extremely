import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ClientRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ClientService } from '@modules/_shared/services/client.service';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [ClientsComponent, CreateClientComponent, EditClientComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule
  ],
  providers: [ClientService, CurrencyPipe, DecimalPipe],
  entryComponents: [EditClientComponent, CreateClientComponent]
})
export class ClientsModule { }
