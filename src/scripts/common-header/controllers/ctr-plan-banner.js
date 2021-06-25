'use strict';

angular.module('risevision.common.header')
  .controller('PlanBannerCtrl', ['$scope', '$rootScope', 'currentPlanFactory',
    function ($scope, $rootScope, currentPlanFactory) {
      $scope.plan = {};
      $scope.showPlans = currentPlanFactory.showPurchaseOptions;

      $rootScope.$on('risevision.plan.loaded', function () {
        $scope.plan = currentPlanFactory.currentPlan;
      });

      $scope.isEnterpriseSubCompany = currentPlanFactory.isEnterpriseSubCompany;

      $scope.getVisibleBanner = function () {
        var banner = 'free';

        if (currentPlanFactory.isParentPlan()) {
          banner = 'parent';
        } else if (currentPlanFactory.currentPlan.isPurchasedByParent) {
          banner = 'parentPurchased';
        } else if (currentPlanFactory.isCancelledActive()) {
          banner = 'cancelled';
        } else if (currentPlanFactory.isFree() && currentPlanFactory.isCancelled()) {
          banner = 'free';
        } else if (currentPlanFactory.isSubscribed()) {
          banner = 'subscribed';
        } else if (currentPlanFactory.isOnTrial()) {
          banner = 'trial';
        } else if (currentPlanFactory.isTrialExpired()) {
          banner = 'expired';
        } else if (currentPlanFactory.isSuspended()) {
          banner = 'suspended';
        }

        return banner;
      };
    }
  ]);
