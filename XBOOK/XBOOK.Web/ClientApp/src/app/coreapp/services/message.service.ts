import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  success(message: string, content: string = '') {
    // Swal.fire(message, content, 'success');
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${message}<p><p class="swal2__content">${content}</p>`,
      showCloseButton: true,
    });
  }
  info(message: string, content: string = '') {
    // Swal.fire(message, content, 'info');
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${message}<p><p class="swal2__content">${content}</p>`,
      showCloseButton: true,
    });
  }
  warning(message: string, content: string = '') {
    // Swal.fire(message, content, 'warning');
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${message}<p><p class="swal2__content">${content}</p>`,
      showCloseButton: true,
    });
  }
  error(message: string, content: string = '') {
    // Swal.fire(message, content, 'error');
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${message}<p><p class="swal2__content">${content}</p>`,
      showCloseButton: true,
    });
  }
  errorHandel(message: string, content: string = '', callBack: () => void) {
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${message}<p><p class="swal2__content">${content}</p>`,
      showCloseButton: true,
    }).then(isConfirm => {
      if (isConfirm.value) {
        callBack();
      }
    }).catch();
  }
  confirm(message: string, content: string, callBack: () => void) {
    Swal.fire({
      title: 'Xbook',
      html: `<p class="swal2__content">${ message || 'Are you sure?'}<p>
              <p class="swal2__content">${ content || 'You won\'t be able to revert this!' }</p>`,
      showCloseButton: true,
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
      title: 'Xbook',
      html: `<p class="swal2__content">${ message || 'Are you sure?'}<p>
              <p class="swal2__content">${ content || 'You won\'t be able to revert this!' }</p>`,
      showCloseButton: true,
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
