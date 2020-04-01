import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrintDesignerComponent } from './print-designer.component';


const routes: Routes = [
  {
    path: '', component: PrintDesignerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PrintDesignerRoutingModule { }
