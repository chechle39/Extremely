
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  options = { timeOut: 1000, progressBar: true, closeButton: true };
  constructor(public toastr: ToastrService) { }
  info(message: string, title?: string, options?: any): void {
    this.toastr.success(message, title, options);
  }

  success(message: string, title?: string, options?: any): void {
    this.toastr.success(message, title, options);
  }

  warn(message: string, title?: string, options?: any): void {
    this.toastr.warning(message, title, options);
  }

  error(message: string, title?: string, options?: any): void {
    this.toastr.error(message, title, options);
  }
}
