'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.purchase', {
          abstract: true,
          template: '<div class="container purchase-app" ui-view></div>'
        })

        .state('apps.purchase.home', {
          url: '/purchase',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/purchase/app-purchase.html');
          }],
          controller: 'PurchaseCtrl',
          resolve: {
            canAccessApps: ['$state', 'canAccessApps', 'purchaseFactory',
              function ($state, canAccessApps, purchaseFactory) {
                return canAccessApps()
                  .then(function() {
                    // Purchase has not been initialized
                    if (!purchaseFactory.purchase) {
                      $state.go('apps.plans.home');
                    }
                  });
              }
            ]
          }
        });
    }
  ]);

angular.module('risevision.apps.purchase', [
  'risevision.store.authorization',
  'risevision.common.config',
  'risevision.common.gapi',
  'risevision.common.geodata',
  'risevision.common.currency',
  'risevision.common.components.loading',
  'risevision.core.countries',
  'ui.bootstrap'
]);
