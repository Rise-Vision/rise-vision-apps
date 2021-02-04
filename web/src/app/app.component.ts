import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;

import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1>`,
})
export class AppComponent  { name = 'Angular'; }

 angular.module('risevision.apps')
    .directive('app-my', 
    downgradeComponent({component: AppComponent}) as angular.IDirectiveFactory);