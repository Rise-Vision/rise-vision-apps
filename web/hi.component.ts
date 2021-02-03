import { Component } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;
 
 @Component({
    selector: 'app-hi',
    template: '<div class="app"> {{ content }} </div>',
    styles: [' .app { color: #000; } ']
 })
 
 export class HiComponent {
    content: string = 'Books are here';
 }

 angular.module('risevision.apps')
    .directive('app-hi', 
    downgradeComponent({component: HiComponent}) as angular.IDirectiveFactory