(function (angular) {

  'use strict';
  angular.module('risevision.common.components.plans')
    .value('PLANS_LIST', [{
      name: 'Free',
      type: 'free',
      order: 0,
      productId: '000',
      productCode: '000',
      status: 'Active',
      proLicenseCount: 0,
      monthly: {
        priceDisplayMonth: 0,
        billAmount: 0,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 0,
        priceDisplayYear: 0,
        billAmount: 0,
        save: 0
      }
    }, {
      name: 'Display Licenses',
      type: 'volume',
      order: 1,
      productId: '2317',
      productCode: '34e8b511c4cc4c2affa68205cd1faaab427657dc',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14,
      discountIndustries: [
        'PRIMARY_SECONDARY_EDUCATION',
        'HIGHER_EDUCATION',
        'LIBRARIES',
        'PHILANTHROPY',
        'NON_PROFIT_ORGANIZATION_MANAGEMENT',
        'RELIGIOUS_INSTITUTIONS'
      ]
    }, {
      name: 'Display Licenses for Education',
      // cannot use type 'volume', it may interfere with the other plan
      type: 'volume for education',
      order: 1,
      productId: '2320',
      productCode: '88725121a2c7a57deefcf06688ffc8e84cc4f93b',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14,
      discountIndustries: [
        'PRIMARY_SECONDARY_EDUCATION',
        'HIGHER_EDUCATION',
        'LIBRARIES',
        'PHILANTHROPY',
        'NON_PROFIT_ORGANIZATION_MANAGEMENT',
        'RELIGIOUS_INSTITUTIONS'
      ]
    }, {
      name: 'Starter',
      type: 'starter',
      order: 1,
      productId: '335',
      productCode: '019137f7bb35f5f90085a033c013672471faadae',
      proLicenseCount: 1,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14
    }, {
      name: 'Basic',
      type: 'basic',
      order: 2,
      productId: '289',
      productCode: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 9,
        billAmount: 27,
        save: 36
      },
      yearly: {
        priceDisplayMonth: 9,
        priceDisplayYear: 99,
        billAmount: 297,
        save: 63
      },
      trialPeriod: 14
    }, {
      name: 'Advanced',
      type: 'advanced',
      order: 3,
      productId: '290',
      productCode: '93b5595f0d7e4c04a3baba1102ffaecb17607bf4',
      proLicenseCount: 11,
      monthly: {
        priceDisplayMonth: 8,
        billAmount: 88,
        save: 264
      },
      yearly: {
        priceDisplayMonth: 8,
        priceDisplayYear: 88,
        billAmount: 968,
        save: 352
      },
      trialPeriod: 14
    }, {
      name: 'Enterprise',
      type: 'enterprise',
      order: 4,
      productId: '301',
      productCode: 'b1844725d63fde197f5125b58b6cba6260ee7a57',
      proLicenseCount: 70,
      monthly: {
        priceDisplayMonth: 7,
        billAmount: 490,
        save: 2520
      },
      yearly: {
        priceDisplayMonth: 7,
        priceDisplayYear: 77,
        billAmount: 5390,
        save: 3010
      }
    }, {
      name: 'Enterprise',
      type: 'enterprisesub',
      order: 5,
      productId: '303',
      productCode: 'd521f5bfbc1eef109481eebb79831e11c7804ad8',
      proLicenseCount: 0
    }])
    .factory('plansFactory', ['$modal', '$templateCache', 'userState', 'PLANS_LIST', 'analyticsFactory',
      'currentPlanFactory', '$state',
      function ($modal, $templateCache, userState, PLANS_LIST, analyticsFactory, currentPlanFactory, $state) {
        var _factory = {};

        _factory.showPlansModal = function () {
          if (!_factory.isPlansModalOpen) {
            _factory.isPlansModalOpen = true;

            var $modalInstance = $modal.open({
              template: $templateCache.get('partials/components/plans/plans-modal.html'),
              controller: 'PlansModalCtrl',
              windowClass: 'pricing-component-modal',
            });

            $modalInstance.result.finally(function () {
              _factory.isPlansModalOpen = false;
            });
          }
        };

        _factory.showPurchaseOptions = function() {
          if (currentPlanFactory.isPlanActive()) {
            $state.go('apps.billing.home');
          } else {
            _factory.showPlansModal();
          }
        };

        _factory.showUnlockThisFeatureModal = function () {
          analyticsFactory.track('free user popup seen', {
            source: 'share schedule button'
          });
          $modal.open({
            templateUrl: 'partials/components/plans/unlock-this-feature-modal.html',
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
            _factory.showPlansModal();
          });
        };

        _factory.showLicenseRequiredToUpdateModal = function () {
          $modal.open({
            templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
            controller: 'confirmModalController',
            windowClass: 'madero-style centered-modal',
            resolve: {
              confirmationTitle: function () {
                return 'Missing Display License';
              },
              confirmationMessage: function () {
                return 'A Display License is required to automatically update your Display. Please restart it to apply the latest changes.';
              },
              confirmationButton: function () {
                return 'Buy a License';
              },
              cancelButton: function () {
                return 'Okay';
              }
            }
          }).result.then(function () {
            _factory.showPurchaseOptions();
          });
        };

        _factory.initVolumePlanTrial = function () {
          var plan = _.find(PLANS_LIST, {
            type: 'volume'
          });
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
