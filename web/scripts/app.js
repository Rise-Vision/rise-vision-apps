'use strict';
angular.module('risevision.app-launcher', [
    'risevision.common.header',
    'risevision.common.header.templates',
    'risevision.common.components.last-modified',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-instance',
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    'risevision.app-launcher.controllers',
    'risevision.app-launcher.directives'
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function storeRouteConfig($urlRouterProvider, $stateProvider,
      $locationProvider) {

      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/');

      // Use $stateProvider to configure states.
      $stateProvider

        .state('main', {
        template: '<div ui-view></div>'
      })

      .state('main.home', {
        url: '/',
        templateUrl: 'partials/app-launcher.html'
      })

      .state('main.gsmodal', {
        url: '/gsmodal',
        templateUrl: 'partials/gs-modal.html'
      })

      .state('main.signup', {
        url: '/signup',
        templateUrl: 'partials/app-launcher.html',
        controller: 'SignUpCtrl'
      })

      .state('main.signin', {
        url: '/signin',
        templateUrl: 'partials/app-launcher.html',
        controller: 'SignInCtrl'
      });
    }
  ]);

angular.module('risevision.common.i18n.config', [])
  .constant('LOCALES_PREFIX',
  'bower_components/rv-common-i18n/dist/locales/translation_')
  .constant('LOCALES_SUFIX', '.json');

angular.module('risevision.app-launcher.controllers', []);
angular.module('risevision.app-launcher.directives', []);
