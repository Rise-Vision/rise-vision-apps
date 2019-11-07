(function () {
  'use strict';

  angular.module('risevision.common.components.password-meter', [
      'oc.lazyLoad'
    ])
    .directive('passwordMeter', ['$templateCache', '$ocLazyLoad',
      function ($templateCache, $ocLazyLoad) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            ngModel: '='
          },
          template: $templateCache.get(
            'partials/components/password-meter/password-meter.html'),
          link: function (scope, element, attrs, ctrl) {
            // scope.ngModelCtrl = ctrl;

            var _initZxcvbn = function() {
              return $ocLazyLoad.load('vendor/zxcvbn/zxcvbn.js');
            };

            _initZxcvbn();

            scope.$watch('ngModel', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                // scope.ngModelCtrl.$setDirty(true);
                _initZxcvbn().then(function(){
                 scope.result = zxcvbn(newValue);
                 scope.scorePercentage = Math.max(25,scope.result.score/4 * 100);
                 _updateStrength(scope.result.score);
                });
              }
            });

            var _updateStrength = function(score) {
              console.log('update')
              if (score === 4) {
                scope.strength = 'Great';
                scope.strengthClass = 'success';
              } else if (score < 4 && score >= 2) {
                scope.strength = 'So-so';
                scope.strengthClass = 'warning';
              } else {
                scope.strength = 'Weak';
                scope.strengthClass = 'danger';
              }
              console.log('update end')
            };
            // var clearFormErrors = function () {
            //   angular.forEach(scope.ngModelCtrl.$error, function (value, name) {
            //     scope.ngModelCtrl.$setValidity(name, null);
            //   });
            // };
          }
        };
      }
    ]);
}())