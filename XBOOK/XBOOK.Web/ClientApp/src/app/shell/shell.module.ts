import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShellRoutingModule } from './shell-routing.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NotificationSidebarComponent } from './layout/notification-sidebar/notification-sidebar.component';
import { SharedModule } from '@shared/shared.module';
import { PrintModule } from '@modules/print/print.module';
@NgModule({
  imports: [
    CommonModule,
    ShellRoutingModule,
    NgbModule,
    DashboardModule,
    SharedModule,
    PrintModule
  ],
  exports: [ShellComponent],
  declarations: [
    ShellComponent,
    FullLayoutComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    NotificationSidebarComponent]
})
export class ShellModule { }
