(function () {
  'use strict';

  angular.module('risevision.common.components.password-input', [
      'oc.lazyLoad'
    ])
    .value('ZXCVBN_PATH', 'vendor/zxcvbn/zxcvbn.js')
    .directive('passwordInput', ['$templateCache', '$ocLazyLoad', 'ZXCVBN_PATH', '$window',
      function ($templateCache, $ocLazyLoad, ZXCVBN_PATH, $window) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            ngModel: '=',
            showPasswordMeter: '=',
            label: '@',
            placeholder: '@'
          },
          template: $templateCache.get(
            'partials/components/password-input/password-input.html'),
          link: function (scope, element, attrs, ctrl) {
            scope.ngModelCtrl = ctrl;
            scope.minlength = attrs.minlength || 0;

            scope.$watch('ngModel', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                scope.ngModelCtrl.$setDirty(true);
              }
              if (scope.showPasswordMeter) {
                $ocLazyLoad.load(ZXCVBN_PATH).then(function () {
                  var result = $window.zxcvbn(newValue);
                  scope.feedback = result.feedback.warning;
                  _updateStrength(scope.ngModelCtrl.$invalid ? 0 : result.score);
                });
              }
            });

            var _updateStrength = function (score) {
              // if score is 0, we still want to show a red progress bar, so we set the minimum percentage to 25%
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
