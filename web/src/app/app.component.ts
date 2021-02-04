import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;

import { Component } from '@angular/core';

@Component({
  selector: 'app-my',
  template: `<h5>My {{name}}-<app-hi></app-hi>-</h5>`,
})
export class AppComponent  { name = 'Angular'; }

 angular.module('risevision.apps')
    .directive('appMy', 
    downgradeComponent({component: AppComponent}) as angular.IDirectiveFactory);