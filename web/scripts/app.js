'use strict';

angular.module('risevision.apps', [
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    'ui.codemirror',
    'truncate',
    'slugifier',
    'ngTagsInput',
    'ngStorage',
    'ngMessages',
    'rzSlider',
    'risevision.common.header',
    'risevision.common.components.last-modified',
    'risevision.common.components.loading',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-modal',
    'risevision.common.components.timeline',
    'risevision.common.components.timeline-basic',
    'risevision.common.components.logging',
    'risevision.common.components.distribution-selector',
    'risevision.common.components.background-image-setting',
    'risevision.common.components.message-box',
    'risevision.common.i18n',
    'risevision.apps.partials',
    'risevision.apps.config',
    'risevision.apps.services',
    'risevision.apps.controllers',
    'risevision.apps.directives',
    'risevision.apps.launcher.controllers',
    'risevision.apps.launcher.directives',
    'risevision.apps.launcher.services',
    'risevision.apps.billing.controllers',
    'risevision.apps.billing.services',
    'risevision.schedules.services',
    'risevision.schedules.controllers',
    'risevision.schedules.filters',
    'risevision.schedules.directives',
    'risevision.displays.services',
    'risevision.displays.controllers',
    'risevision.displays.filters',
    'risevision.displays.directives',
    'risevision.editor.services',
    'risevision.editor.controllers',
    'risevision.editor.filters',
    'risevision.editor.directives',
    'risevision.storage.services',
    'risevision.storage.controllers',
    'risevision.storage.directives',
    'risevision.storage.filters',
    'risevision.widgets.services',
    'risevision.widgets.controllers',
    'risevision.widgets.directives',
    'risevision.widgets.filters',
    'risevision.widgets.twitter',
    'risevision.template-editor.services',
    'risevision.template-editor.directives',
    'risevision.template-editor.controllers',
    'ngQuill'
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps', {
          template: '<div ui-view></div>'
        })

        .state('common.auth.signup', {
          url: '/signup',
          controller: ['$location', '$state', 'canAccessApps', 'plansFactory',
            function ($location, $state, canAccessApps, plansFactory) {
              // jshint camelcase:false
              var showProduct = $location.search().show_product;
              // jshint camelcase:true

              canAccessApps(true).then(function () {
                if (showProduct) {
                  plansFactory.showPlansModal();
                }

                $location.replace();
                $state.go('apps.launcher.home');
              });
            }
          ]
        })

        .state('common.auth.signin', {
          url: '/signin',
          controller: ['$state', 'canAccessApps', '$location',
            function ($state, canAccessApps, $location) {
              canAccessApps().then(function () {
                $location.replace();
                $state.go('apps.launcher.home');
              });
            }
          ]
        })

        .state('common.auth.unregistered', {
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/launcher/signup.html');
          }],
          url: '/unregistered/:state'
        });

    }
  ])
  .config(['$tooltipProvider',
    function storeRouteConfig($tooltipProvider) {
      $tooltipProvider.setTriggers({
        'show': 'hide'
      });
    }
  ])
  .config(['$localStorageProvider',
    function ($localStorageProvider) {
      $localStorageProvider.setKeyPrefix('RiseVision-');
    }
  ])
  .config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
    ngQuillConfigProvider.set();
  }])
  .run(['$rootScope', '$state', '$modalStack', 'userState', 'displayFactory', '$window',
    function ($rootScope, $state, $modalStack, userState, displayFactory, $window) {

      if ($window.Stretchy) {
        $window.Stretchy.selectors.filter = '.input-stretchy, .input-stretchy *';
      }

      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('common.auth.unauthorized');
      });

      $rootScope.$on('distributionSelector.addDisplay', function () {
        displayFactory.addDisplayModal();
      });

      $rootScope.$on('$stateChangeStart', function (event) {
        if (userState.isRiseVisionUser()) {
          $modalStack.dismissAll();
        }
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'apps.launcher.onboarding') {
          $rootScope.showWhiteBackground = true;
        } else {
          $rootScope.showWhiteBackground = false;
        }
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'apps.schedules.list' ||
          $state.current.name === 'apps.editor.list' ||
          $state.current.name === 'apps.displays.list' ||
          $state.current.name === 'apps.displays.alerts' ||
          $state.current.name === 'apps.storage.home' ||
          $state.current.name === 'apps.launcher.home' ||
          $state.current.name === 'apps.launcher.onboarding' ||
          $state.current.name === 'apps.billing.home') {

          $state.go($state.current, null, {
            reload: true
          });
        }
      });
    }
  ]);
