import { Component, Input } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;
 
 @Component({
    selector: 'last-revised',
    templateUrl: 'src/editor/components/last-revised/last-revised.component.html'
 })
 
 export class LastRevisedComponent {
  @Input() changeDate: Date;
  @Input() changedBy: string;
  @Input() revisionStatusName: string;
 }


angular.module('risevision.editor.directives')
  .directive(
    'lastRevised', 
    downgradeComponent({
      component: LastRevisedComponent
    }) as angular.IDirectiveFactory
  );
