'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderNameValidator', ['placeholdersFactory',
    'placeholderFactory',
    function (placeholdersFactory, placeholderFactory) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {

          var checkPlaceholderNames = function (value) {
            var placeholders = placeholdersFactory.getPlaceholders();
            for (var i = 0; i < placeholders.length; i++) {
              if (placeholders[i] !== placeholderFactory.placeholder &&
                !placeholders[i].deleted &&
                (placeholders[i].id === value ||
                  placeholders[i].newId === value)) {
                return false;
              }
            }

            return true;
          };

          var validator = function (value) {
            var result;
            if (/^[a-zA-Z0-9\-\_]*$/.test(value)) {
              ngModel.$setValidity('alphanumeric', true);
            } else {
              ngModel.$setValidity('alphanumeric', false);

              return false;
            }

            if (checkPlaceholderNames(value)) {
              ngModel.$setValidity('duplicate', true);
            } else {
              ngModel.$setValidity('duplicate', false);

              return false;
            }

            return value;
          };

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
