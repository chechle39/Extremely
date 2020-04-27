import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { extract } from '../../coreapp/services/i18n.service';
import { EntrypatternComponent } from './entrypattern.component';


const routes: Routes = [
  { path: '', component: EntrypatternComponent, data: { title: extract('entryPattern') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class EntrypatternRoutingModule { }
