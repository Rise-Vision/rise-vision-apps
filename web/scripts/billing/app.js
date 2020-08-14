'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.billing', {
          url: '?cid',
          abstract: true,
          template: '<div class="container billing-app" ui-view></div>'
        })

        .state('apps.billing.home', {
          url: '/billing?edit',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/billing/app-billing.html');
          }],
          controller: 'BillingCtrl',
          resolve: {
            canAccessApps: ['canAccessApps', '$stateParams', 'ChargebeeFactory', 'userState',
              function (canAccessApps, $stateParams, ChargebeeFactory, userState) {
                return canAccessApps().then(function () {
                  if ($stateParams.edit) {
                    new ChargebeeFactory().openSubscriptionEdit(userState.getSelectedCompanyId(), $stateParams.edit);
                  }
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
  'risevision.common.components.plans'
]);
