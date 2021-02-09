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
  @Input() revisionStatus: number;

  // link: function ($scope) {
  //   $scope.$watch('revisionStatusName', function (newVal) {
  //     if (newVal === 'Published') {
  //       $scope.status = $filter('translate')(
  //         'editor-app.details.published');
  //     } else if (newVal === 'Revised') {
  //       $scope.status = $filter('translate')(
  //         'editor-app.details.revised');
  //     } else {
  //       $scope.status = $filter('translate')(
  //         'editor-app.details.saved');
  //     }
  //   });
  //   var _initializing = true;
  //   $scope.$watch('changedBy', function (newVal) {
  //     if (_initializing) {
  //       _initializing = false;
  //     } else {
  //       $scope.changedBy = newVal ? newVal : 'N/A';
  //     }
  //   });
  // } //link()


 }


angular.module('risevision.editor.directives')
  .directive(
    'lastRevised', 
    downgradeComponent({
      component: LastRevisedComponent
    }) as angular.IDirectiveFactory
  );
