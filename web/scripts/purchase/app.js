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
            canAccessApps: ['canAccessApps', '$stateParams', 'ChargebeeFactory', 'userState',
              function (canAccessApps, $stateParams, ChargebeeFactory, userState) {
                return canAccessApps().then(function () {
                  if ($stateParams.edit) {
                    new ChargebeeFactory().openEditSubscription(userState.getSelectedCompanyId(), $stateParams
                      .edit);
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
