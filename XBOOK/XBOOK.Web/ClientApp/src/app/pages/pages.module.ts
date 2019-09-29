import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    HomeModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
