import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ProductDetailsModalComponent } from 'src/app/editor/components/product-details-modal/product-details-modal.component';

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
      class: 'madero-style centered-modal modal-sm',
      initialState
    }));
  }

  confirm(title: string, message: string) {
    const initialState = {
      title,
      message,
      confirmButton: 'Ok',
      cancelButton: 'Cancel'
    };

    const modalInstance = this.modalService.show(ConfirmModalComponent, Object.assign({}, { 
      class: 'madero-style centered-modal modal-sm',
      initialState
    }));

    return modalInstance.content.promise;
  }

  showComponent(component, params) {
    const modalInstance = this.modalService.show(ProductDetailsModalComponent, Object.assign({}, params));
    return modalInstance.content.promise;
  }

}

angular.module('risevision.template-editor.services')
  .factory('ngModalService', downgradeInjectable(ModalService));