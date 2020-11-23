'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.billing', {
          abstract: true,
          template: '<div class="container billing-app" ui-view></div>'
        })

        .state('apps.billing.home', {
          url: '/billing?edit',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/billing/app-billing.html');
          }],
          controller: 'BillingCtrl',
          resolve: {
            canAccessApps: ['canAccessApps', '$stateParams', 'ChargebeeFactory', 'billingFactory', 'userState',
              function (canAccessApps, $stateParams, ChargebeeFactory, billingFactory, userState) {
                return canAccessApps().then(function () {
                  // Clear potential error messages
                  billingFactory.init();

                  if ($stateParams.edit) {
                    new ChargebeeFactory().openEditSubscription(userState.getSelectedCompanyId(), $stateParams
                      .edit);
                  }
                });
              }
            ]
          }
        })

        .state('apps.billing.invoice', {
          url: '/invoice/:invoiceId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/billing/invoice.html');
          }],
          controller: 'InvoiceCtrl',
          resolve: {
            invoiceInfo: ['canAccessApps', 'billingFactory', '$stateParams',
              function (canAccessApps, billingFactory, $stateParams) {
                return canAccessApps().then(function () {
                  //load the invoice based on the url param
                  billingFactory.getInvoice($stateParams.invoiceId);
                });
              }
            ]
          }
        });
    }
  ]);

angular.module('risevision.apps.billing.controllers', [
  'risevision.apps.billing.services'
]);
angular.module('risevision.apps.billing.services', [
  'risevision.apps.plans'
]);
