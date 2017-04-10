'use strict';
angular.module('risevision.apps.storage.storage-selector', [
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    'ngSanitize',
    'risevision.common.components.last-modified',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-instance',
    'risevision.common.components.analytics',
    'risevision.widget.common',
    'risevision.widget.common.subscription-status',
    'risevision.common.loading',
    'risevision.common.i18n',
    'risevision.common.svg',
    'risevision.apps.partials',
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

        .state('apps.launcher.unregistered', {
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/launcher/signup.html');
          }]
        })

        // storage
        .state('apps.storage', {
          url: '?cid',
          abstract: true,
          template: '<div class="storage-app" ui-view ' +
            'off-canvas-content></div>'
        })

        .state('apps.storage.unauthorized', {
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/storage/login.html');
          }]
        })

        .state('apps.storage.home', {
          url: '/',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/storage/storage-modal.html');
          }],
          controller: 'StorageSelectorIFrameController',
          resolve: {
            canAccessStorage: ['canAccessStorage',
              function (canAccessStorage) {
                return canAccessStorage();
              }
            ],
            selectorType: ['$location',
              function ($location) {
                return $location.search()['selector-type'];
              }
            ],
            selectorFilter: ['$location',
              function ($location) {
                return $location.search()['selector-filter'];
              }
            ]
          }
        });

    }
  ])
  .run(['$rootScope', '$state',
    function ($rootScope, $state) {
      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        $state.go('apps.storage.home', null, {
          reload: true
        });
      });
    }
  ]);

angular.module('risevision.apps.services', []);
angular.module('risevision.apps.controllers', []);


angular.module('risevision.storage.services', [
  'risevision.common.components.userstate'
]);
angular.module('risevision.storage.directives', []);
angular.module('risevision.storage.controllers', []);
angular.module('risevision.storage.filters', ['risevision.common.i18n']);
