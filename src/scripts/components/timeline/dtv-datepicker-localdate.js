// https://gist.github.com/weberste/354a3f0a9ea58e0ea0de

(function (angular) {
  'use strict';
  angular.module('risevision.common.components.timeline')
    .directive('datepickerLocaldate', [

      function () {
        return {
          restrict: 'A',
          require: ['ngModel'],
          link: function ($scope, element, attr, ctrls) {
            var useLocaldate = $scope.$eval(attr.datepickerLocaldate);
            var ngModelController = ctrls[0];
            var formatDate = function (date) {
              return date.toLocaleDateString('en-US') + ' ' +
                date.toLocaleTimeString('en-US');
            };

            // called with a JavaScript Date object when picked from the datepicker
            ngModelController.$parsers.push(function (viewValue) {
              if (!viewValue) {
                return null;
              }

              if (useLocaldate) {
                // undo the timezone adjustment we did during the formatting
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
              } else {
                viewValue = formatDate(viewValue);
              }

              return viewValue;
            });

            // called with a string to format
            ngModelController.$formatters.push(function (modelValue) {
              if (!modelValue) {
                return undefined;
              }
              // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
              var dt = new Date(modelValue);

              if (useLocaldate) {
                // 'undo' the timezone offset again (so we end up on the original date again)
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
              }

              return dt;
            });
          }
        };
      }
    ]);
})(angular);
