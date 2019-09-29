import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UserService } from '../../providers/appuser.service';
import { FormioModule } from 'angular-formio';
import { NbCardModule, NbAccordionModule, NbActionsModule, NbCheckboxModule } from '@nebular/theme';
import { WavesModule, TableModule, CheckboxModule,ButtonsModule,DropdownModule, InputsModule  } from 'angular-bootstrap-md';

@NgModule({
  declarations: [HomeComponent],
  providers: [UserService],
  imports: [
    CommonModule,
    FormioModule,
    NbCardModule,
    WavesModule,
    TableModule,
    ButtonsModule,
    CheckboxModule,
    NbAccordionModule,
    DropdownModule ,
    InputsModule,NbActionsModule,
    NbCheckboxModule
  ],
})
export class HomeModule { }
