(function (angular) {

  'use strict';
  angular.module('risevision.common.components.plans')
    .factory('currentPlanFactory', ['$log', '$rootScope', '$state', '$modal',
    'userState', 'plansService', 'analyticsFactory', 'confirmModal', 'messageBox',
      function ($log, $rootScope, $state, $modal,
        userState, plansService, analyticsFactory, confirmModal, messageBox) {
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

        _factory.isUnlimitedPlan = function() {
          return _factory.currentPlan.type === 'unlimited';
        };

        _loadCurrentPlan();

        $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
          _loadCurrentPlan();
        });

        $rootScope.$on('risevision.company.updated', function () {
          _loadCurrentPlan();
        });

        // old plans factory
        _factory.showPurchaseOptions = function (displayCount) {
          $state.go('apps.purchase.home', {
            displayCount: displayCount
          });
        };

        _factory.confirmAndPurchase = function (displayCount) {
          if (_factory.isParentPlan() || _factory.currentPlan.isPurchasedByParent) {
            var contactInfo = _factory.currentPlan.parentPlanContactEmail ? ' at ' +
              _factory.currentPlan.parentPlanContactEmail : '';
            messageBox('Almost there!',
              'There aren\'t available display licenses to assign to the selected displays. Contact your account administrator' +
              contactInfo + ' for additional display licenses.',
              'Okay, I Got It', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
              );
          } else {
            confirmModal('Almost there!',
                'There aren\'t available display licenses to assign to the selected displays. Subscribe to additional licenses?',
                'Yes', 'No', 'madero-style centered-modal',
                'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
              .then(function () {
                _factory.showPurchaseOptions(displayCount);
              });
          }
        };

        _factory.showUnlockThisFeatureModal = function () {
          analyticsFactory.track('free user popup seen', {
            source: 'share schedule button'
          });
          $modal.open({
            templateUrl: 'partials/plans/unlock-this-feature-modal.html',
            controller: 'confirmModalController',
            windowClass: 'madero-style centered-modal unlock-this-feature-modal',
            size: 'sm',
            resolve: {
              confirmationTitle: null,
              confirmationMessage: null,
              confirmationButton: null,
              cancelButton: null
            }
          }).result.then(function () {
            _factory.showPurchaseOptions();
          });
        };

        _factory.initVolumePlanTrial = function () {
          var plan = plansService.getVolumePlan();

          var licenses = plan.proLicenseCount;
          var selectedCompany = userState.getCopyOfSelectedCompany(true);
          var trialExpiry = new Date();
          trialExpiry.setDate(trialExpiry.getDate() + plan.trialPeriod);
          // Round down the date otherwise the subtraction may calculate an extra day
          trialExpiry.setHours(trialExpiry.getHours() - 1);

          selectedCompany.planProductCode = plan.productCode;
          selectedCompany.planTrialPeriod = plan.trialPeriod;
          selectedCompany.planTrialExpiryDate = trialExpiry;
          selectedCompany.planSubscriptionStatus = 'Trial';
          selectedCompany.playerProTotalLicenseCount = licenses;
          selectedCompany.playerProAvailableLicenseCount = licenses;

          userState.updateCompanySettings(selectedCompany);
        };

        return _factory;
      }
    ]);

})(angular);
