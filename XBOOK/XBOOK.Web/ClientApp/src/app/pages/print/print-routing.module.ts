import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: 'design',
    loadChildren: () => import('./print-designer/print-designer.module')
      .then(m => m.PrintDesignerModule),
  },
  {
    path: '',
    loadChildren: () => import('./print-viewer/print-viewer.module')
      .then(m => m.PrintViewerModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PrintRoutingModule { }
