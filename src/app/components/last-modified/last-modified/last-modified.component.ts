import { Component, Input } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';

import * as angular from 'angular';

@Component({
  selector: 'last-modified',
  templateUrl: './last-modified.component.html',
  styleUrls: ['./last-modified.component.scss']
})
export class LastModifiedComponent {

  @Input() changeDate: Date;
  @Input() changedBy: string;

}

angular.module('risevision.common.components')
  .directive(
    'lastModified', 
    downgradeComponent({
      component: LastModifiedComponent
    }) as angular.IDirectiveFactory
  );
