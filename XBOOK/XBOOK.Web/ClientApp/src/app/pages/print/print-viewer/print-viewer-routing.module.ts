import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrintViewerComponent } from './print-viewer.component';


const routes: Routes = [
  {
    path: ':key', component: PrintViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PrintViewerRoutingModule { }
