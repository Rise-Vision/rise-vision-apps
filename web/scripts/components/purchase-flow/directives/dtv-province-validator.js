angular.module("risevision.common.components.purchase-flow")
  .directive("provinceValidator", ["REGIONS_CA", "REGIONS_US",

    function (REGIONS_CA, REGIONS_US) {
      return {
        require: "ngModel",
        restrict: "A",
        scope: {
          provinceValidator: "="
        },
        link: function ($scope, elem, attr, ngModel) {
          var validator = function (value) {
            // Selected Country passed via the directive
            var country = $scope.provinceValidator;
            var valid = true;

            if (country) {
              if (country === "CA") {
                valid = value && _.find(REGIONS_CA, function (region) {
                  return region[1] === value;
                });
              } else if (country === "US") {
                valid = value && _.find(REGIONS_US, function (region) {
                  return region[1] === value;
                });
              }
            }

            ngModel.$setValidity("validProvince", !!valid);

            return value;
          };

          $scope.$watch("provinceValidator", function () {
            validator(ngModel.$modelValue);
          });

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
