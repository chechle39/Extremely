import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ExtraOptions } from '@angular/router';
import { PreloadAllModules } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./shell/shell.module')
      .then(m => m.ShellModule),
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path: 'request-password',
  //   //  component: NbRequestPasswordComponent,
  // },
  // {
  //   path: 'reset-password',
  //   //  component: NbResetPasswordComponent,
  // },
  // Fallback when no prior route is matched
  { path: '**', redirectTo: 'modules', pathMatch: 'full' },
];
const config: ExtraOptions = {
  useHash: false,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
