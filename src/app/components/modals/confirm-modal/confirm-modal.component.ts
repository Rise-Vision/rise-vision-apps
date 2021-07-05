import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  title: string;
  message: string;
  cancelButton: string;
  confirmButton: string;
  confirmButtonClass = 'btn-primary';

  promise: Promise<void>;
  private reject: any;
  private resolve: any;
  private isConfirmed = false;
  
  constructor(public modalRef: BsModalRef) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.modalRef.onHide.subscribe(() => {
      if (this.isConfirmed) {
        this.resolve();
      } else {
        this.reject();
      }
    });
  }

  confirm() {
    this.isConfirmed = true;
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }

}
