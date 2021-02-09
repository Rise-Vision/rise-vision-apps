import { Component, Input } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
declare var angular: angular.IAngularStatic;
 
 @Component({
    selector: 'last-revised',
    // templateUrl: 'src/editor/components/last-revised/last-revised.component.html'
    template: `
      <span class="text-muted">
        <small>
          <span>
            {{revisionStatusName}}
          </span> 
          {{changeDate | date:'d-MMM-yyyy h:mm a'}} by {{changedBy | username}}
        </small>
      </span>
    `
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
