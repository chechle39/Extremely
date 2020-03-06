import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Credentials, CredentialsService } from './credentials.service';
import { LoginViewModel } from '../../pages/_shared/models/login/login.model';

export interface LoginContext {
  username: string;
  password: string;
  token: string;
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
    if ( sessionStorage.length !== 0) {
      this.currentToken = JSON.parse(sessionStorage.getItem('credentials')).token;
      return this.currentToken;
    } else {
      return null;
    }

  }

}
