'use strict';

angular.module('risevision.common.header.directives')
  .directive('newsletterSignup', ['$templateCache',
    function ($templateCache) {
      return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
          alreadyOptedIn: '=',
          mailSyncEnabled: '=ngModel'
        },
        template: $templateCache.get('partials/common-header/newsletter-signup.html'),
        link: function ($scope) {
          $scope.showNewsletterSignup = function () {
            return !$scope.alreadyOptedIn;
          };

        }
      };
    }
  ]);
