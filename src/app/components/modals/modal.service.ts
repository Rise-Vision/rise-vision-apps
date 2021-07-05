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

  show(title: string, message: string) {
    const initialState = {
      title,
      message
    };

    this.modalService.show(MessageBoxComponent, Object.assign({}, { 
      class: 'madero-style modal-sm',
      initialState
    }));
  }

  confirm(title: string, message: string, confirmButton?: string, cancelButton?: string) {
    const initialState = {
      title,
      message,
      confirmButton: confirmButton || 'Ok',
      cancelButton: cancelButton || 'Cancel'
    };
    return this._showConfirmModal(initialState);
  }

  confirmDanger(title: string, message: string, confirmButton?: string, cancelButton?: string) {
    const initialState = {
      title,
      message,
      confirmButton: confirmButton || 'Ok',
      confirmButtonClass: 'btn-danger',
      cancelButton: cancelButton || 'Cancel'
    };
    return this._showConfirmModal(initialState);
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