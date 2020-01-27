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
    'risevision.widgets.image',
    'risevision.widgets.twitter',
    'risevision.template-editor.services',
    'risevision.template-editor.directives',
    'risevision.template-editor.controllers'
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    '$tooltipProvider',
    function storeRouteConfig($urlRouterProvider, $stateProvider,
      $locationProvider, $tooltipProvider) {
      $tooltipProvider.setTriggers({
        'show': 'hide'
      });

      // Use $stateProvider to configure states.
      $stateProvider.state('apps', {
          template: '<div ui-view></div>'
        })

        .state('apps.launcher', {
          url: '?cid',
          abstract: true,
          template: '<div class="container app-launcher" ui-view></div>'
        })

        .state('apps.launcher.home', {
          url: '/',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/launcher/app-launcher.html');
          }],
          controller: 'HomeCtrl',
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

                $state.go('apps.launcher.home');
              });
            }
          ]
        })

        .state('common.auth.signin', {
          url: '/signin',
          controller: ['$state', 'canAccessApps',
            function ($state, canAccessApps) {
              canAccessApps().then(function () {
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
        })

        // billing
        .state('apps.billing', {
          url: '?cid',
          abstract: true,
          template: '<div class="container billing-app" ui-view></div>'
        })

        .state('apps.billing.home', {
          url: '/billing',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/billing/app-billing.html');
          }],
          controller: 'BillingCtrl',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        // schedules
        .state('apps.schedules', {
          url: '?cid',
          abstract: true,
          template: '<div class="container schedules-app" ui-view></div>'
        })

        .state('apps.schedules.home', {
          url: '/schedules',
          controller: ['canAccessApps', '$state',
            function (canAccessApps, $state) {
              canAccessApps().then(function () {
                $state.go('apps.schedules.list');
              });
            }
          ]
        })

        .state('apps.schedules.list', {
          url: '/schedules/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedules-list.html');
          }],
          controller: 'schedulesList',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        .state('apps.schedules.details', {
          url: '/schedules/details/:scheduleId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-details.html');
          }],
          controller: 'scheduleDetails',
          resolve: {
            scheduleInfo: ['canAccessApps', 'scheduleFactory',
              '$stateParams',
              function (canAccessApps, scheduleFactory, $stateParams) {
                return canAccessApps().then(function () {
                  //load the schedule based on the url param
                  return scheduleFactory.getSchedule($stateParams.scheduleId);
                });
              }
            ]
          }
        })

        .state('apps.schedules.add', {
          url: '/schedules/add',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-add.html');
          }],
          controller: 'scheduleAdd',
          resolve: {
            scheduleInfo: ['canAccessApps', 'scheduleFactory',
              function (canAccessApps, scheduleFactory) {
                return canAccessApps().then(scheduleFactory.newSchedule);
              }
            ]
          }
        })

        // displays
        .state('apps.displays', {
          url: '?cid',
          abstract: true,
          template: '<div class="container displays-app" ui-view></div>'
        })

        .state('apps.displays.home', {
          url: '/displays',
          controller: ['canAccessApps', '$state',
            function (canAccessApps, $state) {
              canAccessApps().then(function () {
                $state.go('apps.displays.list');
              });
            }
          ]
        })

        .state('apps.displays.list', {
          url: '/displays/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/displays-list.html');
          }],
          controller: 'displaysList',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        .state('apps.displays.change', {
          url: '/displays/change/:displayId/:companyId',
          controller: ['canAccessApps', 'userState', '$stateParams',
            '$state', '$location',
            function (canAccessApps, userState, $stateParams, $state,
              $location) {
              return canAccessApps().then(function () {
                  if (userState.getSelectedCompanyId() !== $stateParams
                    .companyId) {
                    return userState.switchCompany($stateParams.companyId);
                  } else {
                    return true;
                  }
                })
                .then(function () {
                  $location.replace();
                  $state.go('apps.displays.details', {
                    displayId: $stateParams.displayId
                  });
                });
            }
          ]
        })

        .state('apps.displays.details', {
          url: '/displays/details/:displayId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/display-details.html');
          }],
          controller: 'displayDetails',
          resolve: {
            displayId: ['canAccessApps', '$stateParams',
              function (canAccessApps, $stateParams) {
                return canAccessApps().then(function () {
                  return $stateParams.displayId;
                });
              }
            ]
          }
        })

        .state('apps.displays.alerts', {
          url: '/alerts',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/displays/alerts.html');
          }],
          controller: 'AlertsCtrl',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        // editor
        .state('apps.editor', {
          url: '?cid',
          abstract: true,
          template: '<div class="editor-app" ui-view></div>'
        })

        .state('apps.editor.home', {
          url: '/editor',
          controller: ['canAccessApps', '$state',
            function (canAccessApps, $state) {
              canAccessApps().then(function () {
                $state.go('apps.editor.list');
              });
            }
          ]
        })

        .state('apps.editor.list', {
          url: '/editor/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/editor/presentation-list.html');
          }],
          controller: 'PresentationListController',
          resolve: {
            canAccess: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        .state('apps.editor.add', {
          url: '/editor/add/:productId',
          controller: ['$state', '$stateParams', '$location', 'canAccessApps', 'editorFactory',
            function ($state, $stateParams, $location, canAccessApps, editorFactory) {
              canAccessApps().then(function () {
                if ($stateParams.productId) {
                  editorFactory.addFromProductId($stateParams.productId)
                    .then(function () {
                      $location.replace();
                    });
                } else {
                  editorFactory.addPresentationModal();

                  $state.go('apps.editor.list');
                }
              });
            }
          ]
        })

        .state('apps.editor.workspace', {
          url: '/editor/workspace/:presentationId?copyOf',
          abstract: true,
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/editor/workspace.html');
          }],
          controller: 'WorkspaceController',
          params: {
            isLoaded: false,
            skipAccessNotice: false
          },
          resolve: {
            presentationInfo: ['canAccessApps', 'editorFactory', '$stateParams', 'checkTemplateAccess',
              function (canAccessApps, editorFactory, $stateParams, checkTemplateAccess) {
                var signup = false;

                if ($stateParams.copyOf) {
                  signup = true;
                }

                return canAccessApps(signup)
                  .then(function () {
                    if ($stateParams.presentationId && $stateParams.presentationId !== 'new') {
                      return editorFactory.getPresentation($stateParams.presentationId);
                    } else if ($stateParams.copyOf) {
                      if ($stateParams.isLoaded) {
                        return editorFactory.presentation;
                      } else {
                        return editorFactory.copyTemplate($stateParams.copyOf);
                      }
                    } else {
                      return editorFactory.newPresentation();
                    }
                  })
                  .then(function (presentationInfo) {
                    if (!$stateParams.skipAccessNotice) {
                      checkTemplateAccess();
                    }

                    return presentationInfo;
                  });
              }
            ]
          }
        })

        .state('apps.editor.workspace.artboard', {
          url: '',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/editor/artboard.html');
          }],
          reloadOnSearch: false,
          controller: 'ArtboardController'
        })

        .state('apps.editor.workspace.htmleditor', {
          url: '/htmleditor',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/editor/html-editor.html');
          }],
          reloadOnSearch: false,
          controller: 'HtmlEditorController'
        })

        .state('apps.editor.templates', {
          url: '/templates',
          abstract: true,
          template: '<div class="templates-app" ui-view></div>'
        })

        .state('apps.editor.templates.edit', {
          url: '/edit/:presentationId/:productId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/template-editor/template-editor.html');
          }],
          reloadOnSearch: false,
          controller: 'TemplateEditorController',
          params: {
            productDetails: null,
            skipAccessNotice: false
          },
          resolve: {
            presentationInfo: ['$stateParams', 'canAccessApps', 'editorFactory', 'templateEditorFactory',
              'checkTemplateAccess', 'financialLicenseFactory',
              function ($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess,
                financialLicenseFactory) {
                var signup = false;

                if ($stateParams.presentationId === 'new' && $stateParams.productId) {
                  signup = true;
                }

                return canAccessApps(signup)
                  .then(function () {
                    if ($stateParams.presentationId === 'new') {
                      if ($stateParams.productDetails) {
                        return templateEditorFactory.addFromProduct($stateParams.productDetails);
                      } else {
                        return editorFactory.addFromProductId($stateParams.productId);
                      }
                    } else {
                      return templateEditorFactory.getPresentation($stateParams.presentationId);
                    }
                  })
                  .then(function () {
                    if ($stateParams.presentationId === 'new' && financialLicenseFactory
                      .needsFinancialDataLicense()) {
                      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();
                    } else if (!$stateParams.skipAccessNotice) {
                      checkTemplateAccess(true);
                    }
                  });
              }
            ]
          }
        })

        // storage
        .state('apps.storage', {
          url: '?cid',
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
  ])
  .config(['$localStorageProvider',
    function ($localStorageProvider) {
      $localStorageProvider.setKeyPrefix('RiseVision-');
    }
  ])
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

angular.module('risevision.common.components.logging')
  .value('GA_LINKER_USE_ANCHOR', false);

angular.module('risevision.apps.services', [
  'risevision.common.header'
]);
angular.module('risevision.apps.controllers', [
  'risevision.common.config'
]);
angular.module('risevision.apps.directives', [
  'risevision.common.components.scrolling-list'
]);

angular.module('risevision.apps.launcher.controllers', [
  'risevision.apps.launcher.services'
]);
angular.module('risevision.apps.launcher.directives', []);
angular.module('risevision.apps.launcher.services', [
  'ngStorage'
]);

angular.module('risevision.apps.billing.controllers', [
  'risevision.apps.billing.services'
]);
angular.module('risevision.apps.billing.services', [
  'risevision.common.components.plans'
]);

angular.module('risevision.schedules.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.launcher.services'
]);
angular.module('risevision.schedules.filters', []);
angular.module('risevision.schedules.directives', [
  'risevision.schedules.filters'
]);
angular.module('risevision.schedules.controllers', []);


angular.module('risevision.displays.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.config',
  'risevision.apps.services'
]);
angular.module('risevision.displays.filters', []);
angular.module('risevision.displays.directives', [
  'risevision.displays.filters'
]);
angular.module('risevision.displays.controllers', []);


angular.module('risevision.editor.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.store.product',
  'risevision.common.components.subscription-status',
  'risevision.apps.config',
  'risevision.displays.services'
]);
angular.module('risevision.editor.filters', []);
angular.module('risevision.editor.directives', [
  'risevision.editor.filters'
]);
angular.module('risevision.editor.controllers', []);

angular.module('risevision.storage.services', [
  'risevision.common.header',
  'risevision.common.gapi'
]);
angular.module('risevision.storage.directives', []);
angular.module('risevision.storage.controllers', []);
angular.module('risevision.storage.filters', ['risevision.common.i18n']);

// Declare legacy subscription-status [error without it]
angular.module('risevision.widget.common.subscription-status', []);

angular.module('risevision.widgets.services', []);
angular.module('risevision.widgets.directives', []);
angular.module('risevision.widgets.controllers', []);
angular.module('risevision.widgets.filters', []);

// Template Editor
angular.module('risevision.template-editor.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.config',
  'risevision.editor.services',
  'risevision.schedules.services'
]);
angular.module('risevision.template-editor.filters', []);
angular.module('risevision.template-editor.directives', [
  'risevision.template-editor.services',
  'risevision.template-editor.filters'
]);

angular.module('risevision.template-editor.controllers', [
  'risevision.template-editor.services'
]);
