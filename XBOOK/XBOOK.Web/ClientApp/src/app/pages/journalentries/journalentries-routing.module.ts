import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '../../coreapp/services/i18n.service';
import { JournalEntriesComponent } from './journalentries.component';
import { ListJournalEntriesComponent } from './list-journalentries/list-journalentries.component';

const routes: Routes = [
  {
    path: '', component: JournalEntriesComponent, data: { title: extract(' JournalEntries') },
    children: [
      {
        path: '',
        component: ListJournalEntriesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class JournalEntriesRoutingModule { }
