import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { DataService } from '../../pages/_shared/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  // might inject some type of authservice here for token
  constructor(private authenticationService: AuthenticationService, private data: DataService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header (fake value is shown here)
    let requestConfig = {
      setHeaders: {},
      withCredentials: false,
    };
    const authHeader =  this.authenticationService.getAuthToken() as string;
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authHeader),
    });

    const authToken = this.authenticationService.getAuthToken() as string;
    if (authToken !== null) {
      requestConfig = {
        setHeaders: { Authorization: 'Bearer ' + authToken },
        withCredentials: true,
      };
    } else {
      this.data.getMessageEmail().subscribe(rp => {
        if (rp !== undefined) {
          requestConfig = {
            setHeaders: { Authorization: 'Bearer ' + rp.data},
            withCredentials: true,
          };
        }
      });
    }
    req = req.clone(requestConfig);
    return next.handle(req);
  }
}
