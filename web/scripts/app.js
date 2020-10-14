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
    'risevision.template-editor.controllers'
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps', {
          url: '?cid',
          abstract: true,
          template: '<div ui-view></div>'
        })

        .state('apps.home', {
          url: '/',
          controller: ['$location', '$state',
            function ($location, $state) {
              $location.replace();
              $state.go('apps.editor.home');
            }
          ]
        })

        .state('apps.plans', {
          url: '/plans?cid',
          controller: ['$location', '$state',
            function ($location, $state) {
              $location.replace();
              $state.go('apps.home');
            }
          ]
        })
        .state('apps.users', {
          abstract: true,
          url: '?cid',
          template: '<div ui-view></div>'
        })
        .state('apps.users.add', {
          url: '/users/add',
          controller: ['$location', '$state',
            function ($location, $state) {
              $location.replace();
              $state.go('apps.home');
            }
          ]
        })

        .state('common.auth.signup', {
          url: '/signup',
          controller: ['$location', '$state', 'canAccessApps',
            function ($location, $state, canAccessApps) {
              canAccessApps(true).then(function () {
                $location.replace();
                $state.go('apps.home');
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
                $state.go('apps.home');
              });
            }
          ]
        })

        .state('common.auth.unregistered', {
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/common/signup.html');
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
  .config(['$localStorageProvider', '$sessionStorageProvider',
    function ($localStorageProvider, $sessionStorageProvider) {
      $localStorageProvider.setKeyPrefix('RiseVision-');
      $sessionStorageProvider.setKeyPrefix('RiseVision-');
    }
  ])
  .run(['$rootScope', '$state', '$modalStack', 'userState', '$window',
    function ($rootScope, $state, $modalStack, userState, $window) {

      if ($window.Stretchy) {
        $window.Stretchy.selectors.filter = '.input-stretchy, .input-stretchy *';
      }

      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('common.auth.unauthorized');
      });

      $rootScope.$on('$stateChangeStart', function (event) {
        if (userState.isRiseVisionUser()) {
          $modalStack.dismissAll();
        }
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'apps.displays.alerts' ||
          toState.name.indexOf('apps.editor.workspace') !== -1 ||
          toState.name.indexOf('apps.storage') !== -1 ||
          toState.name.indexOf('apps.billing') !== -1) {
          $rootScope.showWhiteBackground = false;
        } else {
          $rootScope.showWhiteBackground = true;
        }
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'apps.schedules.list' ||
          $state.current.name === 'apps.editor.list' ||
          $state.current.name === 'apps.displays.list' ||
          $state.current.name === 'apps.displays.alerts' ||
          $state.current.name === 'apps.storage.home' ||
          $state.current.name === 'apps.home' ||
          $state.current.name === 'apps.billing.home') {

          $state.go($state.current, null, {
            reload: true
          });
        }
      });
    }
  ])
  .run(['$rootScope', '$location', '$modal', 'canAccessApps', 'userState', 'plansFactory',
    function ($rootScope, $location, $modal, canAccessApps, userState, plansFactory) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // jshint camelcase:false
        var showProduct = $location.search().show_product;
        // jshint camelcase:true

        if (toState.name === 'apps.plans' || (toState.name === 'common.auth.signup' && showProduct)) {
          canAccessApps(toState.name === 'common.auth.signup').then(function () {
            plansFactory.showPurchaseOptions();
          });

          if (fromState.name) {
            event.preventDefault();
          }
        } else if (toState.name === 'apps.users.add') {
          canAccessApps().then(function () {
            $modal.open({
              templateUrl: 'partials/common-header/user-settings-modal.html',
              controller: 'AddUserModalCtrl',
              resolve: {
                companyId: function () {
                  return userState.getSelectedCompanyId();
                }
              }
            });
          });

          if (fromState.name) {
            event.preventDefault();
          }
        }
      });
    }
  ]);
