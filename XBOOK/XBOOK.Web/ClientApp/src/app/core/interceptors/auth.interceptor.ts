import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  // might inject some type of authservice here for token
  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header (fake value is shown here)
    let requestConfig = {
      setHeaders: {},
      withCredentials: false
    };
    const authHeader =  this.authenticationService.getAuthToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authHeader)
    });
    // if (this.authService.isAnonymousRoute(req.url)) {
    //   req = req.clone(requestConfig);
    //   return next.handle(req);
    // }
    const authToken = this.authenticationService.getAuthToken() as string;
    // const authToken = ''; // this.authService.getAuthToken() as string;
    if (authToken !== '') {
      requestConfig = {
        setHeaders: { Authorization: 'Bearer ' + authToken },
        withCredentials: true
      };
    }
    req = req.clone(requestConfig);
    return next.handle(authReq);
  }
}
