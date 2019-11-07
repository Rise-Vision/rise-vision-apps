(function () {
  'use strict';

  angular.module('risevision.common.components.password-input', [
      'oc.lazyLoad'
    ])
    .directive('passwordInput', ['$templateCache', '$ocLazyLoad', '$window',
      function ($templateCache, $ocLazyLoad, $window) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            ngModel: '=',
            isCreating: '='
          },
          template: $templateCache.get(
            'partials/components/password-input/password-input.html'),
          link: function (scope, element, attrs, ctrl) {
            scope.ngModelCtrl = ctrl;

            scope.$watch('ngModel', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                scope.ngModelCtrl.$setDirty(true);
              }
              if (scope.isCreating) {
                $ocLazyLoad.load('vendor/zxcvbn/zxcvbn.js').then(function () {
                  var result = $window.zxcvbn(newValue);
                  scope.feedback = result.feedback.warning;
                  _updateStrength(scope.ngModelCtrl.$invalid ? 0 : result.score);
                });
              }
            });

            var _updateStrength = function (score) {
              scope.scorePercentage = Math.max(25, score / 4 * 100);
              if (score === 4) {
                scope.strength = 'Great';
                scope.strengthClass = 'success';
              } else if (score < 4 && score >= 2) {
                scope.strength = 'Ok';
                scope.strengthClass = 'warning';
              } else {
                scope.strength = 'Weak';
                scope.strengthClass = 'danger';
              }
            };
          }
        };
      }
    ]);
}());
