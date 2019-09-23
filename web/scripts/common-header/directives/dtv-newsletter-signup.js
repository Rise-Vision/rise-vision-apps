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
          $scope.showNewsletterSignup = function () {
            return ($scope.companyIndustry === 'PRIMARY_SECONDARY_EDUCATION' ||
              $scope.companyIndustry === 'HIGHER_EDUCATION');
          };

        }
      };
    }
  ]);
