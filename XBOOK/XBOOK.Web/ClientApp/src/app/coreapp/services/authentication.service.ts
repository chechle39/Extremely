import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Credentials, CredentialsService } from './credentials.service';

export interface LoginContext {
  username: string;
  password: string;
  token: string;
  role: any;
  permission: any;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentToken: string;
  constructor(private credentialsService: CredentialsService) { }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call

    const data = {
      username: context.username,
      token: context.token,
      role: context.role,
      permission: context.permission,
    };
    this.credentialsService.setCredentials(data, context.remember);

    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  getAuthToken() {
    if (sessionStorage.length !== 0) {
      this.currentToken = JSON.parse(sessionStorage.getItem('credentials')).token;
      return this.currentToken;
    } else {
      return null;
    }

  }

  getLoggedInUser() {
    let user = {
      role: null,
      permission: null,
    };
    if (this.getAuthToken() !== null) {
      const userData = JSON.parse(sessionStorage.getItem('credentials'));
      user = {
        role: userData.role,
        permission: userData.permission,
      } ;
    } else {
      user = null;
    }
    return user;
  }

  checkAccess(functionId: string) {
    const user = this.getLoggedInUser();
    const permission: any[] = user.permission;
    const hasPermission: number = permission.findIndex(x => x.FunctionId === functionId && x.Read === true);
    if (hasPermission !== -1 ) {
      return true;
    } else {
      return false;
    }
  }
  hasPermission(functionId: string, action: string): boolean {
    const user = this.getLoggedInUser();
    let result: boolean = false;
    const permission: any[] = user.permission;
    const roles: any[] = user.role;
    switch (action) {
      case 'create':
        const perCreate: number = permission.findIndex(x => x.FunctionId === functionId && x.Create === true);
        if (perCreate !== -1 ) {
          result = false;
        } else {
          result = true;
        }
        break;
      case 'update':
        const perUpdate: number = permission.findIndex(x => x.FunctionId === functionId && x.Update === true);
        if (perUpdate !== -1) {
          result = false;
        } else {
          result = true;
        }
        break;
      case 'delete':
        const perDeleted: number = permission.findIndex(x => x.FunctionId === functionId && x.Delete === true);
        if (perDeleted !== -1) {
          result = false;
        } else {
          result = true;
        }
        break;
    }
    return result;
  }
}
