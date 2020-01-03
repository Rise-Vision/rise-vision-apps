'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('ifOnboarding', ['onboardingFactory', '$rootScope',
    function (onboardingFactory, $rootScope) {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          element.hide();

          var checkOnboarding = function () {
            if (onboardingFactory.isOnboarding()) {
              element.show();
            } else {
              element.hide();
            }
          };
          $rootScope.$on('risevision.company.updated', checkOnboarding);
          $rootScope.$on('risevision.company.selectedCompanyChanged', checkOnboarding);
          $rootScope.$on('risevision.user.updated', checkOnboarding);
        }
      };
    }
  ]);
