import { Injectable, EventEmitter } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';

@Injectable({
  providedIn: 'root'
})
export class BroadcasterService extends EventEmitter {}

angular.module('risevision.template-editor.services')
  .factory('ngBroadcaster', downgradeInjectable(BroadcasterService));
