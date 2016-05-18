'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('prioritySupportBanner', ['localStorageService', 'subscriptionStatusFactory', 'SUPPORT_PRODUCT_CODE', 'supportFactory',
    function (localStorageService, subscriptionStatusFactory, SUPPORT_PRODUCT_CODE, supportFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/launcher/priority-support-banner.html',
        link: function ($scope) {
          $scope.showBanner = false;

          if (localStorageService.get('prioritySupportBanner.show') !== 'false') {
            subscriptionStatusFactory.checkProductCode(SUPPORT_PRODUCT_CODE).then(function(subscriptionStatus){
              if (subscriptionStatus && subscriptionStatus.status === "Not Subscribed") {
                $scope.showBanner = true;
              }
            });
          }

          $scope.openPrioritySupport = function() {
            $scope.showBanner = false;
            supportFactory.handlePrioritySupportAction();
          }
          
          $scope.closeBanner = function () {
            $scope.showBanner = false;
            localStorageService.set('prioritySupportBanner.show', false);
          };
        }
      };
    }
  ]);
