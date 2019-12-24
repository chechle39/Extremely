import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class DataService {
  xxx: string;
  private messageSource = new BehaviorSubject<any>(this.xxx);
  private subject = new Subject<any>();
  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  sendMessage(message: string) {
    this.xxx = message;
    this.messageSource.next({ text: message });
    this.messageSource.asObservable();
  }
  getMessage(): Observable<any> {
    return this.messageSource.asObservable();
  }
}
