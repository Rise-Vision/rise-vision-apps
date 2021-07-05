import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: BsModalService) { }

  showMessage(title: string, message: string) {
    const initialState = {
      title,
      message
    };

    this.modalService.show(MessageBoxComponent, Object.assign({}, { 
      class: 'madero-style modal-sm',
      initialState
    }));
  }

  confirm(title: string, message: string, confirmButton = 'Ok', cancelButton = 'Cancel') {
    return this._showConfirmModal({
      title,
      message,
      confirmButton,
      cancelButton
    });
  }

  confirmDanger(title: string, message: string, confirmButton = 'Ok', cancelButton = 'Cancel') {
    return this._showConfirmModal({
      confirmButtonClass: 'btn-danger',
      title,
      message,
      confirmButton,
      cancelButton
    });
  }

  _showConfirmModal(initialState: any) {
    const modalInstance = this.modalService.show(ConfirmModalComponent, Object.assign({}, { 
      class: 'madero-style modal-md',
      initialState
    }));
    return modalInstance.content.promise;
  }

}

angular.module('risevision.template-editor.services')
  .factory('ngModalService', downgradeInjectable(ModalService));