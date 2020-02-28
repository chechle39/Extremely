import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class DataService {
  data: any;
  private messageSource = new BehaviorSubject<any>(this.data);
  private subject = new Subject<any>();
  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  sendMessage(message: any) {
    this.data = message;
    this.messageSource.next({ data: message });
    this.messageSource.asObservable();
  }

  getMessage(): Observable<any> {
    return this.messageSource.asObservable();
  }

}
