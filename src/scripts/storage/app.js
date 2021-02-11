'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.storage', {
          abstract: true,
          template: '<div class="storage-app" ui-view></div>'
        })

        .state('apps.storage.home', {
          url: '/storage',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/storage/home.html');
          }],
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        });

    }
  ]);

angular.module('risevision.storage.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.common.components.plans'
]);
angular.module('risevision.storage.directives', []);
angular.module('risevision.storage.controllers', []);
angular.module('risevision.storage.filters', ['risevision.common.i18n']);
