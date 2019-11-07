(function () {
  'use strict';

  angular.module('risevision.common.components.password-meter', [
      'oc.lazyLoad'
    ])
    .directive('passwordMeter', ['$templateCache', '$ocLazyLoad',
      function ($templateCache, $ocLazyLoad) {
        return {
          restrict: 'E',
          scope: {
            watchValue: '='
          },
          template: $templateCache.get(
            'partials/components/password-meter/password-meter.html'),
          link: function (scope, element, attrs, ctrl) {
            var _initZxcvbn = function() {
              return $ocLazyLoad.load('vendor/zxcvbn/zxcvbn.js');
            };
            _initZxcvbn();

            scope.$watch('watchValue', function (newValue, oldValue) {
              _initZxcvbn().then(function(){
               var result = zxcvbn(newValue);
               scope.scorePercentage = Math.max(25, result.score/4 * 100);
               scope.feedback = result.feedback.warning;
               _updateStrength(result.score);
              });
            });

            var _updateStrength = function(score) {
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
}())