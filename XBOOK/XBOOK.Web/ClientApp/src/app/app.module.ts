/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbWindowModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProvidersModule } from './providers/providers.module';
import { UserService } from './providers/appuser.service';
import { WavesModule, MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [AppComponent],
  providers: [UserService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    CoreModule.forRoot(),
    ModalModule.forRoot(),
    ProvidersModule,
    HttpClientModule,
    CommonModule,
    WavesModule.forRoot(),
    MDBBootstrapModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
