(function (angular) {

  'use strict';
  angular.module('risevision.common.components.plans')
    .factory('plansFactory', ['$modal', 'userState', 'plansService', 'analyticsFactory',
      '$state', 'confirmModal', 'currentPlanFactory', 'messageBox',
      function ($modal, userState, plansService, analyticsFactory, $state, confirmModal, currentPlanFactory,
        messageBox) {
        var _factory = {};

        _factory.showPurchaseOptions = function (displayCount) {
          $state.go('apps.purchase.home', {
            displayCount: displayCount
          });
        };

        _factory.confirmAndPurchase = function (displayCount) {
          if (currentPlanFactory.isParentPlan() || currentPlanFactory.currentPlan.isPurchasedByParent) {
            var contactInfo = currentPlanFactory.currentPlan.parentPlanContactEmail ? ' at ' +
              currentPlanFactory.currentPlan.parentPlanContactEmail : '';
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
