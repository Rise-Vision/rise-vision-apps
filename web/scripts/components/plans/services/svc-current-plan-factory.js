(function (angular) {

  'use strict';
  angular.module('risevision.common.components.plans')
    .factory('currentPlanFactory', ['$log', '$rootScope', '$timeout', 'userState', 'plansService',
      function ($log, $rootScope, $timeout, userState, plansService) {
        var _factory = {};

        var _loadCurrentPlan = function () {
          var company = userState.getCopyOfSelectedCompany();
          var plan = null;

          if (company.id && company.parentPlanProductCode) {
            plan = _.cloneDeep(plansService.getPlan(company.parentPlanProductCode));
            plan.isParentPlan = true;
            plan.status = 'Active';

          } else if (company.id && company.planProductCode) {
            plan = _.cloneDeep(plansService.getPlan(company.planProductCode));

            plan.status = company.planSubscriptionStatus;
            plan.trialPeriod = company.planTrialPeriod;
            plan.currentPeriodEndDate = new Date(company.planCurrentPeriodEndDate);
            plan.trialExpiryDate = new Date(company.planTrialExpiryDate);

          } else {
            plan = _.cloneDeep(plansService.getFreePlan());
          }

          _factory.currentPlan = plan;

          plan.subscriptionId = company.planSubscriptionId;
          plan.playerProTotalLicenseCount = company.playerProTotalLicenseCount;
          plan.playerProAvailableLicenseCount = company.playerProAvailableLicenseCount;

          plan.shareCompanyPlan = company.shareCompanyPlan;

          plan.billToId = company.planBillToId;
          plan.isPurchasedByParent = !!company.planBillToId && !!company.planShipToId && (company.planBillToId !==
            company.planShipToId) && (_factory.isSubscribed() || _factory.isCancelledActive());
          plan.parentPlanCompanyName = company.parentPlanCompanyName;
          plan.parentPlanContactEmail = company.parentPlanContactEmail;

          $log.debug('Current plan', plan);
          $rootScope.$emit('risevision.plan.loaded', plan);
        };

        var _reloadCurrentPlan = function () {
          $log.debug('Reloading current plan');

          $timeout(function () {
            userState.reloadSelectedCompany()
              .then(_loadCurrentPlan)
              .catch(function (err) {
                $log.error('Error reloading plan information', err);
              })
              .finally(function () {
                $log.debug('Finished reloading current plan');
              });
          }, 10000);
        };

        _factory.isPlanActive = function () {
          return _factory.isSubscribed() || _factory.isOnTrial() || _factory.isCancelledActive();
        };

        _factory.isFree = function () {
          return _factory.currentPlan.type === 'free';
        };

        _factory.isParentPlan = function () {
          return !!_factory.currentPlan.isParentPlan;
        };

        _factory.isEnterpriseSubCompany = function () {
          return _factory.currentPlan.type === 'enterprisesub';
        };

        _factory.isSubscribed = function () {
          return !_factory.isFree() && _factory.currentPlan.status === 'Active';
        };

        _factory.isOnTrial = function () {
          return !_factory.isFree() && _factory.currentPlan.status === 'Trial';
        };

        _factory.isTrialExpired = function () {
          return !_factory.isFree() && _factory.currentPlan.status === 'Trial Expired';
        };

        _factory.isSuspended = function () {
          return !_factory.isFree() && _factory.currentPlan.status === 'Suspended';
        };

        _factory.isCancelled = function () {
          return !_factory.isFree() && _factory.currentPlan.status === 'Cancelled';
        };

        _factory.isCancelledActive = function () {
          var now = new Date();

          return _factory.isCancelled() && (_factory.currentPlan.currentPeriodEndDate > now);
        };

        _loadCurrentPlan();

        $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
          _loadCurrentPlan();
        });

        $rootScope.$on('risevision.company.updated', function () {
          _loadCurrentPlan();
        });

        $rootScope.$on('chargebee.subscriptionChanged', function () {
          _reloadCurrentPlan();
        });

        $rootScope.$on('chargebee.subscriptionCancelled', function () {
          _reloadCurrentPlan();
        });

        return _factory;
      }
    ]);

})(angular);
