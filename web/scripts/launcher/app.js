'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.launcher', {
          url: '?cid',
          abstract: true,
          template: '<div class="app-launcher" ui-view></div>'
        })

        .state('apps.launcher.home', {
          url: '/',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/launcher/apps-home.html');
          }],
          controller: 'AppsHomeCtrl',
          resolve: {
            canAccessApps: ['$state', '$location', 'canAccessApps', 'onboardingFactory',
              function ($state, $location, canAccessApps, onboardingFactory) {
                return canAccessApps().then(function () {
                  if (onboardingFactory.isOnboarding()) {
                    $location.replace();
                    $state.go('apps.launcher.onboarding');
                  }
                });
              }
            ]
          }
        })

        .state('apps.launcher.onboarding', {
          url: '/onboarding',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/launcher/onboarding.html');
          }],
          controller: 'OnboardingCtrl',
          resolve: {
            canAccessApps: ['$state', '$location', 'canAccessApps', 'onboardingFactory',
              function ($state, $location, canAccessApps, onboardingFactory) {
                return canAccessApps().then(function () {
                  if (!onboardingFactory.isOnboarding()) {
                    $location.replace();
                    $state.go('apps.launcher.home');
                  }
                });
              }
            ]
          }
        });

    }
  ]);

angular.module('risevision.apps.launcher.controllers', [
  'risevision.apps.launcher.services'
]);
angular.module('risevision.apps.launcher.directives', []);
angular.module('risevision.apps.launcher.services', [
  'ngStorage'
]);
