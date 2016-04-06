'use strict';
angular.module('risevision.apps.storage.storage-selector', [
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    // 'ui.bootstrap.showErrors',
    'risevision.common.components.last-modified',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-instance',
    'risevision.common.components.analytics',
    'risevision.widget.common',
    'risevision.common.loading',
    'risevision.common.i18n',
    'risevision.apps.config',
    'risevision.apps.services',
    'risevision.apps.controllers',
    'risevision.storage.services',
    'risevision.storage.controllers',
    'risevision.storage.directives',
    'risevision.storage.filters',
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function storeRouteConfig($urlRouterProvider, $stateProvider,
      $locationProvider) {

      // $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/');

      // Use $stateProvider to configure states.
      $stateProvider.state('apps', {
        template: '<div ui-view></div>'
      })

      .state('apps.launcher', {
        abstract: true,
        template: '<div class="website" ui-view></div>'
      })

      .state('apps.launcher.unauthorized', {
        templateUrl: 'partials/launcher/login.html'
      })

      .state('apps.launcher.unregistered', {
        templateUrl: 'partials/launcher/signup.html'
      })

      // storage
      .state('apps.storage', {
        url: '?cid',
        abstract: true,
        template: '<div class="storage-app" ui-view ' +
          'off-canvas-content></div>'
      })

      .state('apps.storage.home', {
        url: '/',
        templateUrl: 'partials/storage/storage-modal.html',
        controller: 'StorageSelectorModalController',
        resolve: {
          '$modalInstance': [function () {
            return {
              close: function () {},
              dismiss: function () {}
            };
          }],
          canAccessApps: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
            }
          ]
        }
      });

    }
  ])
  .run(['storageFactory', 'SELECTOR_TYPES', '$location',
    function (storageFactory, SELECTOR_TYPES, $location) {
      storageFactory.selectorType = $location.search()['selector-type'] ===
        SELECTOR_TYPES.SINGLE_FOLDER ? SELECTOR_TYPES.SINGLE_FOLDER :
        SELECTOR_TYPES.SINGLE_FILE;
      storageFactory.storageIFrame = true;
      storageFactory.storageFull = false;
    }
  ]);

angular.module('risevision.apps.services', []);
angular.module('risevision.apps.controllers', []);


angular.module('risevision.storage.services', [
  'risevision.common.components.userstate'
]);
angular.module('risevision.storage.directives', [
  'ui.bootstrap'
]);
angular.module('risevision.storage.controllers', []);
angular.module('risevision.storage.filters', []);
