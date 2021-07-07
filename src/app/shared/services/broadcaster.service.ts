import { Inject, Injectable, EventEmitter } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';

@Injectable({
  providedIn: 'root'
})
export class BroadcasterService extends EventEmitter {

  constructor(@Inject('$rootScope') private $rootScope:any ) {
    super();
  }

  emit(event: String) {
    super.emit(event);

    this.$rootScope.$broadcast(event);
  }

  emitWithParams(event: String, param: any) {
    super.emit(event);

    this.$rootScope.$broadcast(event, param);
  }
}

angular.module('risevision.apps.services')
  .factory('broadcaster', downgradeInjectable(BroadcasterService));
