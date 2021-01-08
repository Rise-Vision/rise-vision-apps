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
    'risevision.apps.billing.directives',
    'risevision.apps.billing.controllers',
    'risevision.apps.billing.services',
    'risevision.apps.purchase',
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
          controller: ['$location', '$state', 'canAccessApps',
            function ($location, $state, canAccessApps) {
              return canAccessApps().then(function () {
                $location.replace();
                $state.go('apps.editor.home');
              });
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
              // jshint camelcase:false
              var showProduct = $location.search().show_product;
              // jshint camelcase:true

              return canAccessApps(true).then(function () {
                $location.replace();
                if (showProduct) {
                  $state.go('apps.purchase.plans');
                } else {
                  $state.go('apps.home');
                }
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
  .run(['$window',
    function ($window) {
      if ($window.Stretchy) {
        $window.Stretchy.selectors.filter = '.input-stretchy, .input-stretchy *';
      }
    }
  ])
  .run(['$rootScope', '$state', '$modalStack', 'userState', '$window', '$exceptionHandler',
    function ($rootScope, $state, $modalStack, userState, $window, $exceptionHandler) {

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
          toState.name.indexOf('apps.storage') !== -1) {
          $rootScope.showWhiteBackground = false;
        } else {
          $rootScope.showWhiteBackground = true;
        }
      });

      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, err) {
        $exceptionHandler(err, 'UI Router Error.', true);
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
        } else if ($state.current.name.indexOf('apps.purchase') !== -1) {
          $state.go('apps.home');
        }
      });
    }
  ])
  .run(['$rootScope', '$modal', 'canAccessApps', 'userState',
    function ($rootScope, $modal, canAccessApps, userState) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'apps.users.add') {
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
