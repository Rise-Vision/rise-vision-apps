angular.module("risevision.common.components.plans")
  .controller("PlansModalCtrl", [
    "$scope", "$rootScope", "$modalInstance", "$log", "$loading", "$timeout", "getCompany",
    "plansFactory", "currentPlanFactory", "ChargebeeFactory", "userState", "purchaseFactory",
    "PLANS_LIST", "CHARGEBEE_PLANS_USE_PROD",
    function ($scope, $rootScope, $modalInstance, $log, $loading, $timeout, getCompany,
      plansFactory, currentPlanFactory, ChargebeeFactory, userState, purchaseFactory,
      PLANS_LIST, CHARGEBEE_PLANS_USE_PROD) {

      var volumePlan = PLANS_LIST.filter(function (plan) {
        return plan.name === "Volume";
      })[0];

      $scope.pricingAtLeastOneDisplay = true;
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.purchaseFactory = purchaseFactory;
      $scope.chargebeeFactory = new ChargebeeFactory();
      $scope.startTrialError = null;
      $scope.isMonthly = true;
      $scope.pricingComponentDiscount = false;
      $scope.useProductionChargebeeData = CHARGEBEE_PLANS_USE_PROD === "true";

      function _setPricingComponentDiscount() {
        var companyIndustry = userState.getCopyOfSelectedCompany().companyIndustry;

        $scope.pricingComponentDiscount = volumePlan
          .discountIndustries.indexOf(companyIndustry) >= 0;
      }

      function _getPlansDetails() {
        $loading.start("plans-modal");

        return plansFactory.getPlansDetails()
          .then(function (resp) {
            $scope.plans = resp;
          })
          .finally(function () {
            $loading.stop("plans-modal");
          });
      }

      function _showSubscriptionDetails() {
        var company = userState.getCopyOfSelectedCompany();

        $scope.chargebeeFactory.openSubscriptionDetails(company.id, company.planSubscriptionId);
      }

      $scope.isCurrentPlan = function (plan) {
        return $scope.currentPlan.type === plan.type;
      };

      $scope.isCurrentPlanSubscribed = function (plan) {
        return $scope.isCurrentPlan(plan) && $scope.isSubscribed(plan);
      };

      $scope.isOnTrial = function (plan) {
        return plan.statusCode === "on-trial";
      };

      $scope.isTrialAvailable = function (plan) {
        return plan.statusCode === "trial-available";
      };

      $scope.isTrialExpired = function (plan) {
        return plan.statusCode === "trial-expired";
      };

      $scope.isSubscribed = function (plan) {
        return plan.status === "Subscribed" || plan.status === "Active";
      };

      $scope.isFree = function (plan) {
        return plan.type === "free";
      };

      $scope.isStarter = function (plan) {
        return plan.type === "starter";
      };

      $scope.showSavings = function (plan) {
        return !$scope.isFree(plan) && (!$scope.isStarter(plan) || !$scope.isMonthly);
      };

      $scope.currentPlanLabelVisible = function (plan) {
        // Has a Plan?
        if (currentPlanFactory.isPlanActive()) {
          // Is it the Current Plan?
          return $scope.isCurrentPlan(plan);
        } else { // Were on Free Plan
          // Is it the Free Plan?
          return $scope.isFree(plan);
        }
      };

      $scope.getVisibleAction = function (plan) {
        // Has a Plan?
        if (currentPlanFactory.isPlanActive()) {
          // Is this that Plan?
          if ($scope.isCurrentPlan(plan)) {
            // Can buy Subscription?
            if ($scope.isOnTrial(plan)) {
              return "subscribe";
            } else {
              return "";
            }
          } else { // This is a different Plan
            // Is lower Plan?
            if ($scope.currentPlan.order > plan.order) {
              if (currentPlanFactory.isOnTrial() && !$scope.isFree(plan)) { // Does not have Chargebee account, use Purchase Flow
                return "downgrade";
              } else { // Already has Chargebee account, use Customer Portal
                return "downgrade-portal";
              }
            } else if (currentPlanFactory.isOnTrial()) { // Does not have Chargebee account, use Purchase Flow
              return "subscribe";
            } else { // Already has Chargebee account, use Customer Portal
              return "subscribe-portal";
            }
          }
        } else { // Were on Free Plan
          // Is there a Trial?
          if ($scope.isFree(plan)) {
            return "";
          } else if ($scope.isTrialAvailable(plan)) {
            return "start-trial";
          } else { // Subscribe using Purchase Flow
            return "subscribe";
          }
        }
      };

      $scope.startTrial = function (plan) {
        $loading.start("plans-modal");
        $scope.startTrialError = null;

        plansFactory.startTrial(plan)
          .then(function () {
            return $timeout(10000)
              .then(function () {
                return userState.reloadSelectedCompany();
              })
              .then(function () {
                $rootScope.$emit("risevision.company.trial.started");
              })
              .catch(function (err) {
                $log.debug("Failed to reload company", err);
              })
              .finally(function () {
                $modalInstance.close(plan);
              });
          })
          .catch(function (err) {
            $scope.startTrialError = err;
          })
          .finally(function () {
            $loading.stop("plans-modal");
          });
      };

      $scope.showPurchaseModal = function (plan, isMonthly) {
        purchaseFactory.showPurchaseModal(plan, isMonthly)
          .then($scope.dismiss);
      };

      $scope.downgradePortal = _showSubscriptionDetails;

      $scope.subscribePortal = _showSubscriptionDetails;

      $scope.purchaseAdditionalLicenses = _showSubscriptionDetails;

      $scope.isChargebee = function () {
        return userState.isSelectedCompanyChargebee();
      };

      $scope.refreshButton = function () {
        var component = document.querySelector("pricing-component");

        $scope.pricingAtLeastOneDisplay = component &&
          component.displayCount &&
          component.displayCount > 0;
      };

      $scope.dismissAndShowPurchaseModal = function () {
        var component = document.querySelector("pricing-component");

        var displays = component.displayCount;
        var period = component.period === "yearly" ? "Yearly" : "Monthly";
        var tierName = component.tierName;
        var s = displays > 1 ? "s" : "";
        var plan = "" + displays + " Display" + s + " (" + tierName + " Plan, " + period + ")";

        if (displays === 0 || displays === "0") {
          return;
        }

        $modalInstance.dismiss("cancel");
        $scope.showPurchaseModal({
          name: plan,
          productId: volumePlan.productId,
          productCode: volumePlan.productCode,
          displays: displays,
          yearly: {
            billAmount: component.priceTotal
          },
          monthly: {
            billAmount: component.priceTotal
          }
        }, component.period === "monthly");
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss("cancel");
      };

      $scope.init = function () {
        _getPlansDetails();
        _setPricingComponentDiscount();
      };

      $scope.init();
    }

  ]);
