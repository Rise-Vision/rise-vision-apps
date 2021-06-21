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
            canAccessApps: ['canAccessApps', 'invoiceFactory',
              function (canAccessApps, invoiceFactory) {
                return canAccessApps().then(function () {
                  // Clear potential error messages
                  invoiceFactory.init();
                });
              }
            ]
          }
        })

        .state('apps.billing.unpaid', {
          url: '/billing/unpaid?:token',
          templateUrl: 'partials/billing/unpaid-invoices.html',
          controller: 'UnpaidInvoicesCtrl',
          forceAuth: false
        })

        .state('apps.billing.subscription', {
          url: '/billing/subscription/:subscriptionId',
          templateUrl: 'partials/billing/subscription.html',
          controller: 'SubscriptionCtrl',
          resolve: {
            invoiceInfo: ['canAccessApps', 'subscriptionFactory', '$stateParams',
              function (canAccessApps, subscriptionFactory, $stateParams) {
                return canAccessApps().then(function () {
                  subscriptionFactory.getSubscription($stateParams.subscriptionId, true);
                });
              }
            ]
          }
        })

        .state('apps.billing.payment', {
          url: '/billing/payment/:subscriptionId',
          templateUrl: 'partials/billing/add-payment-source.html',
          controller: 'AddPaymentSourceCtrl',
          resolve: {
            invoiceInfo: ['canAccessApps', 'subscriptionFactory', '$stateParams',
              function (canAccessApps, subscriptionFactory, $stateParams) {
                return canAccessApps().then(function () {
                  subscriptionFactory.getSubscription($stateParams.subscriptionId);
                });
              }
            ]
          }
        })

        .state('apps.billing.invoice', {
          url: '/billing/invoice/:invoiceId?:token',
          templateUrl: 'partials/billing/invoice.html',
          controller: 'InvoiceCtrl',
          resolve: {
            invoiceInfo: ['invoiceFactory', '$stateParams',
              function (invoiceFactory, $stateParams) {
                // pass $stateParams to service as values could be blank before state is loaded
                invoiceFactory.getInvoice($stateParams.invoiceId, $stateParams.cid, $stateParams.token);
              }
            ]
          },
          forceAuth: false
        });
    }
  ]);

angular.module('risevision.apps.billing.directives', []);
angular.module('risevision.apps.billing.filters', [
  'risevision.common.components.plans'
]);
angular.module('risevision.apps.billing.controllers', [
  'risevision.apps.billing.services'
]);
angular.module('risevision.apps.billing.services', [
  'risevision.core.util',
  'risevision.store.services',
  'risevision.common.components.plans'
]);
