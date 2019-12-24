import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  // might inject some type of authservice here for token
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header (fake value is shown here)
    let requestConfig = {
      setHeaders: {},
      withCredentials: false
    };
    const authHeader = '49a5kdkv409fd39'; // this.authService.getAuthToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });
    // if (this.authService.isAnonymousRoute(req.url)) {
    //   req = req.clone(requestConfig);
    //   return next.handle(req);
    // }
    const authToken = ''; // this.authService.getAuthToken() as string;
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
