import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { MessageBoxComponent } from './message-box.component';

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  constructor(private modalService: BsModalService) { }

  open(title: string, message: string) {
    const initialState = {
      title,
      message
    };
    //TODO: madero-style centered-modal are originally set to the modal class div; so here we should be setting to the modal-container component instead
    this.modalService.show(MessageBoxComponent, Object.assign({}, { 
      class: 'madero-style centered-modal modal-sm',
      initialState
    }));
  }

}

angular.module('risevision.template-editor.services')
  .factory('ngMessageBox', downgradeInjectable(MessageBoxService));