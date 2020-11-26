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
          templateUrl: 'partials/billing/app-billing.html',
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

        .state('apps.billing.unpaid', {
          url: '/billing/unpaid?:token',
          templateUrl: 'partials/billing/unpaid-invoices.html',
          controller: 'UnpaidInvoicesCtrl'
        })

        .state('apps.billing.invoice', {
          url: '/billing/invoice/:invoiceId?:token',
          templateUrl: 'partials/billing/invoice.html',
          controller: 'InvoiceCtrl',
          resolve: {
            invoiceInfo: ['billingFactory', '$stateParams',
              function (billingFactory, $stateParams) {
                // pass $stateParams to service as values could be blank before state is loaded
                billingFactory.getInvoice($stateParams.invoiceId, $stateParams.cid, $stateParams.token);
              }
            ]
          }
        });
    }
  ]);

angular.module('risevision.apps.billing.directives', []);
angular.module('risevision.apps.billing.controllers', [
  'risevision.apps.billing.services'
]);
angular.module('risevision.apps.billing.services', [
  'risevision.store.services',
  'risevision.apps.plans'
]);
