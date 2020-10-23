(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.apps')
    // Set up our mappings between URLs, templates, and controllers
    .config(['$stateProvider',
      function storeRouteConfig($stateProvider) {

        // Use $stateProvider to configure states.
        $stateProvider
          .state('apps.plans', {
            abstract: true,
            template: '<div class="container plans-app" ui-view></div>'
          })

          .state('apps.plans.home', {
            url: '/plans',
            templateProvider: ['$templateCache', function ($templateCache) {
              return $templateCache.get('partials/plans/app-plans.html');
            }],
            controller: 'PlansCtrl',
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

  angular.module('risevision.apps.plans.services', [
    'risevision.store.authorization',
    'risevision.common.gapi',
    'risevision.common.currency'
  ]);

  angular.module('risevision.apps.plans', [
    'risevision.common.config',
    'risevision.common.components.confirm-modal',
    'risevision.common.components.message-box',
    'risevision.apps.plans.services',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.loading',
    'ui.bootstrap'
  ]);

})(angular);
