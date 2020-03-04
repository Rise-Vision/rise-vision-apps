(function () {
  'use strict';

  angular.module('risevision.widgets.directives', ['risevision.common.i18n'])
    .directive('widgetButtonToolbar', [function () {
      return {
        restrict: 'E',
        scope: {
          save: '&',
          cancel: '&',
          disableSave: '&'
        },
        templateUrl: 'partials/widgets/widget-button-toolbar.html'
      };
    }]);
}());