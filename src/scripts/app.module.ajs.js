'use strict';

angular.module('risevision.apps', [
    'ui.router',
    'ui.router.state.events',
    'ngTouch',
    'ui.bootstrap',
    'ui.codemirror',
    'truncate',
    'slugifier',
    'ngTagsInput',
    'ngStorage',
    'ngMessages',
    'rzSlider',
    'risevision.common.config',
    'risevision.common.header',
    'risevision.common.components.last-modified',
    'risevision.common.components.loading',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.canva-type-picker',
    'risevision.common.components.confirm-modal',
    'risevision.common.components.timeline',
    'risevision.common.components.timeline-basic',
    'risevision.common.components.logging',
    'risevision.common.components.distribution-selector',
    'risevision.common.components.background-image-setting',
    'risevision.common.components.message-box',
    'risevision.common.components.store-products',
    'risevision.common.i18n',
    'risevision.apps.partials',
    'risevision.apps.services',
    'risevision.apps.controllers',
    'risevision.apps.directives',
    'risevision.apps.billing.directives',
    'risevision.apps.billing.filters',
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
          params: {
            cid: ''
          },
          abstract: true,
          template: '<div ui-view></div>'
        })

        .state('apps.home', {
          url: '/',
          redirectTo: 'apps.editor.home'
        })

        .state('apps.users', {
          abstract: true,
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
      if ($window.Stretchy && $window.Stretchy.selectors) {
        $window.Stretchy.selectors.filter = '.input-stretchy, .input-stretchy *';
      }
    }
  ])
  .run(['$rootScope', '$state', '$exceptionHandler',
    function ($rootScope, $state, $exceptionHandler) {

      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('common.auth.unauthorized');
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

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, err) {
        $exceptionHandler(err, 'UI Router Error.', true);
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'apps.schedules.list' ||
          $state.current.name === 'apps.editor.list' ||
          $state.current.name === 'apps.displays.list' ||
          $state.current.name === 'apps.displays.alerts' ||
          $state.current.name === 'apps.storage.home' ||
          $state.current.name === 'apps.home') {

          $state.go($state.current, $state.params, {
            reload: true
          });
        } else if (($state.current.name.indexOf('apps.purchase') !== -1 ||
            $state.current.name.indexOf('apps.billing') !== -1) &&
          $state.current.forceAuth !== false) {

          $state.go('apps.billing.home', $state.params, {
            reload: true
          });
        }
      });
    }
  ])
  .run(['$rootScope', '$modal', '$modalStack', 'canAccessApps', 'userState',
    function ($rootScope, $modal, $modalStack, canAccessApps, userState) {
      var $modalInstance;

      $rootScope.$on('$stateChangeStart', function (event) {
        if (userState.isRiseVisionUser() && !$modalInstance) {
          $modalStack.dismissAll();
        }
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'apps.users.add') {
          canAccessApps().then(function () {
            $modalInstance = $modal.open({
                templateUrl: 'partials/common-header/user-settings-modal.html',
                controller: 'AddUserModalCtrl',
                resolve: {
                  companyId: function () {
                    return userState.getSelectedCompanyId();
                  }
                }
              })
              .result.finally(function () {
                $modalInstance = null;
              });
          });

          if (fromState.name) {
            event.preventDefault();
          }
        }
      });
    }
  ]);
