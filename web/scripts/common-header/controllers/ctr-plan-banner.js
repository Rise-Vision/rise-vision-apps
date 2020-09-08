'use strict';

angular.module('risevision.common.header')
  .value('ACCOUNT_PATH', 'account?cid=companyId')
  .controller('PlanBannerCtrl', ['$scope', '$rootScope', 'userState', 'plansFactory',
    'currentPlanFactory', 'STORE_URL', 'ACCOUNT_PATH',
    function ($scope, $rootScope, userState, plansFactory, currentPlanFactory,
      STORE_URL, ACCOUNT_PATH) {
      $scope.plan = {};
      $scope.showPlans = plansFactory.showPlansModal;
      $scope.storeAccountUrl = STORE_URL + ACCOUNT_PATH;

      $rootScope.$on('risevision.plan.loaded', function () {
        $scope.plan = currentPlanFactory.currentPlan;
        $scope.isChargebee = userState.isSelectedCompanyChargebee();
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
