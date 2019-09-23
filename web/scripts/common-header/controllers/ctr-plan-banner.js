angular.module("risevision.common.header")
  .controller("PlanBannerCtrl", ["$scope", "$rootScope", "$window", "userState", "plansFactory",
    "currentPlanFactory", "STORE_URL", "ACCOUNT_PATH", "APPS_URL",
    function ($scope, $rootScope, $window, userState, plansFactory, currentPlanFactory,
      STORE_URL, ACCOUNT_PATH, APPS_URL) {
      $scope.plan = {};
      $scope.showPlans = plansFactory.showPlansModal;
      $scope.storeAccountUrl = STORE_URL + ACCOUNT_PATH;

      $rootScope.$on("risevision.plan.loaded", function () {
        $scope.plan = currentPlanFactory.currentPlan;
        $scope.isChargebee = userState.isSelectedCompanyChargebee();
      });

      $scope.isEnterpriseSubCompany = currentPlanFactory.isEnterpriseSubCompany;

      $scope.getVisibleBanner = function () {
        var banner = "free";

        if (currentPlanFactory.isParentPlan()) {
          banner = "parent";
        } else if (currentPlanFactory.currentPlan.isPurchasedByParent) {
          banner = "parentPurchased";
        } else if (currentPlanFactory.isCancelledActive()) {
          banner = "cancelled";
        } else if (currentPlanFactory.isFree() && currentPlanFactory.isCancelled()) {
          banner = "free";
        } else if (currentPlanFactory.isSubscribed()) {
          banner = "subscribed";
        } else if (currentPlanFactory.isOnTrial()) {
          banner = "trial";
        } else if (currentPlanFactory.isTrialExpired()) {
          banner = "expired";
        } else if (currentPlanFactory.isSuspended()) {
          banner = "suspended";
        }

        return banner;
      };

      $scope.isApps = function () {
        return APPS_URL === "" || $window.location.href.startsWith(APPS_URL);
      };

    }
  ]);
