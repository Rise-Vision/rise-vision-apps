'use strict';

angular.module('risevision.common.header.directives')
  .directive('newsletterSignup', ['$templateCache',
    function ($templateCache) {
      return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
          mailSyncEnabled: '=ngModel',
          companyIndustry: '='
        },
        template: $templateCache.get('partials/common-header/newsletter-signup.html'),
        link: function ($scope) {
          var alreadyOptedIn = $scope.mailSyncEnabled;

          $scope.showNewsletterSignup = function () {
            var isEducation = $scope.companyIndustry === 'PRIMARY_SECONDARY_EDUCATION' ||
              $scope.companyIndustry === 'HIGHER_EDUCATION';

            return isEducation && !alreadyOptedIn;
          };

        }
      };
    }
  ]);
