import { Component, Input } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';

import * as angular from 'angular';

@Component({
  selector: 'last-revised',
  templateUrl: './last-revised.component.html',
  styleUrls: ['./last-revised.component.scss']
})
export class LastRevisedComponent {

  @Input() changeDate: Date;
  @Input() changedBy: string;
  @Input() revisionStatusName: string;

}

angular.module('risevision.common.components')
  .directive(
    'lastRevised', 
    downgradeComponent({
      component: LastRevisedComponent
    }) as angular.IDirectiveFactory
  );
