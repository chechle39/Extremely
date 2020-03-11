import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrintModule } from './print/print.module';
import { MenuService } from './_shared/services/menu.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    SharedModule,
    PrintModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [MenuService]
})
export class PagesModule {
}
