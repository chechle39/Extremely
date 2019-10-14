import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Decides if a route can be activated.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // if (
    //   this.authService.isAuthenticated() &&
    //   this.authService.isUserInRole(ROLES.pcc)
    // ) {
    //   return true;
    // }

    // this.authService.logout();
    // this.authService.setRedirectUrl(state.url);
    // this.router.navigate(["/authentication/login"]);
    return false;
  }
}
