import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class DataService {
  data: any;
  private messageSource = new BehaviorSubject<any>(this.data);
  private subject = new Subject<any>();
  code: any;
  codeToForm: any;
  sendEmailLogin: any;
  private codeSource = new BehaviorSubject<any>(this.code);
  private codeSourceToForm = new BehaviorSubject<any>(this.code);
  private sendEmailLoginSource = new BehaviorSubject<any>(this.sendEmailLogin);
  // private sendEmailLoginSourceToForm = new BehaviorSubject<any>(this.sendEmailLogin);
  private codesubject = new Subject<any>();
  constructor() { }


  changeMessageMoneyFund(message: string) {
    this.messageSource.next(message);
  }
  sendMessageMoneyFund(message: any) {
    this.data = message;
    this.messageSource.next({ data: message });
    this.messageSource.asObservable();
  }

  getMessageMoneyFund(): Observable<any> {
    return this.messageSource.asObservable();
  }
  changeMessagebuyInvoice(message: string) {
    this.messageSource.next(message);
  }
  sendMessagebuyInvoice(message: any) {
    this.data = message;
    this.messageSource.next({ data: message });
    this.messageSource.asObservable();
  }

  getMessagebuyInvoice(): Observable<any> {
    return this.messageSource.asObservable();
  }


  changeMessageInvoice(message: string) {
    this.messageSource.next(message);
  }
  sendMessageInvoice(message: any) {
    this.data = message;
    this.messageSource.next({ data: message });
    this.messageSource.asObservable();
  }

  getMessageInvoice(): Observable<any> {
    return this.messageSource.asObservable();
  }

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

  changeMessageCode(message: string) {
    this.codeSource.next(message);
  }

  sendMessageCode(message: any) {
    this.code = message;
    this.codeSource.next({ data: message });
    this.codeSource.asObservable();
  }

  getMessageCode(): Observable<any> {
    return this.codeSource.asObservable();
  }

  sendMessageCodeToFormReset(message: any) {
    this.codeToForm = message;
    this.codeSourceToForm.next({ data: message });
    this.codeSourceToForm.asObservable();
  }
  getMessageCodeToFormReset(): Observable<any> {
    return this.codeSourceToForm.asObservable();
  }

  sendMessageEmail(message: any) {
    this.codeToForm = message;
    this.sendEmailLoginSource.next({ data: message });
    this.sendEmailLoginSource.asObservable();
  }
  getMessageEmail(): Observable<any> {
    return this.sendEmailLoginSource.asObservable();
  }
  ///
  changeMessageReload(message: string) {
    this.messageSource.next(message);
  }
  sendMessagereload(message: any) {
    this.data = message;
    this.messageSource.next({ data: message });
    this.messageSource.asObservable();
  }

  getMessagereload(): Observable<any> {
    return this.messageSource.asObservable();
  }
}
