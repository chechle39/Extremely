import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected baseUrl: string;

  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }
  private processUrl<T>(url: string) {
    let endpoint = this.baseUrl + url;
    endpoint = endpoint.replace(/[?&]$/, '');
    return endpoint;
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.processUrl(url));
  }

  post<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(this.processUrl(url), data);
  }

  postcsv<T>(url: string, data: T): Observable<T> {
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }
    return this.http.post<T>(this.processUrl(url), data,requestOptions);
  }

  getFilex<T>(url: string, data: T): Observable<T> {
    const requestOptions: Object = {
      /* other options here */
      responseType: 'img/png'
    }
    return this.http.post<T>(this.processUrl(url), data,requestOptions);
  }
  postUploadImg<T>(url: string, files: T): Observable<T> {
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return  this.http.post<T>(this.processUrl(url), formData, {reportProgress: true});
  }

  put<T>(url: string, data: T): Observable<T> {
    return this.http.put<T>(this.processUrl(url), data);
  }

  delete(url: string) {
    return this.http.delete(this.processUrl(url));
  }
  
}
