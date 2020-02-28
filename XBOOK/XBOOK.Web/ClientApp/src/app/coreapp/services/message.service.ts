import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  success(message: string, content: string = '') {
    Swal.fire(message, content, 'success');
  }
  info(message: string, content: string = '') {
    Swal.fire(message, content, 'info');
  }
  warning(message: string, content: string = '') {
    Swal.fire(message, content, 'warning');
  }
  error(message: string, content: string = '') {
    Swal.fire(message, content, 'error');
  }
  confirm(message: string, content: string, callBack: () => void) {
    Swal.fire({
      title: message || 'Are you sure?',
      text: content || 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(isConfirm => {
      if (isConfirm.value) {
        callBack();
      }
    }).catch();
  }
  confirm1(message: string, content: string, callBack: () => void) {
    Swal.fire({
      title: message || 'Are you sure?',
      text: content || 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'Yes',
    }).then(isConfirm => {
      if (isConfirm.value) {
        callBack();
      }
    }).catch();
  }
}
