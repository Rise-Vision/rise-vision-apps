(function () {
  'use strict';

  angular.module('risevision.apps.launcher.directives')
    .directive('wizardProgressBar', [
      function () {
        return {
          restrict: 'E',
          scope: {
            numberOfSteps: '=',
            currentStep: '='
          },
          templateUrl: 'partials/launcher/wizard-progress-bar.html',
          link: function ($scope) {
            $scope._ = _;
          } //link()
        };
      }
    ]);
}());
