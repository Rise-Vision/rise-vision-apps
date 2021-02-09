import { Component } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;
 
 @Component({
    selector: 'app-hi',
    template: '<div class="app"> {{ content }} </div>',
    styles: [' .app { color: #000; } ']
 })
 
 export class HiComponent {
    content: string = 'Hi Angular 2';
 }


angular.module('risevision.apps')
  .directive(
    'appHi', 
    downgradeComponent({
      component: HiComponent
    }) as angular.IDirectiveFactory
  );
