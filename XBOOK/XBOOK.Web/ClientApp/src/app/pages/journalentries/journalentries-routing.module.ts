import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '../../coreapp/services/i18n.service';
import { CreateJournalEntriesComponent } from './create-journalentries/create-journalentries.component';
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
      {
        path: 'new',
        component: CreateJournalEntriesComponent,
      },
      {
        path: ':id/:key',
        component: CreateJournalEntriesComponent,
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
