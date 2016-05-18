'use strict';
angular.module('risevision.apps', [
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    // 'ui.bootstrap.showErrors',
    'risevision.common.header',
    'risevision.common.header.templates',
    'risevision.common.components.last-modified',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-instance',
    'risevision.common.components.timeline',
    'risevision.common.components.analytics',
    'risevision.common.components.distribution-selector',
    'risevision.common.components.presentation-selector',
    'risevision.common.components.background-image-setting',
    'risevision.widget.common',
    'ui.codemirror',
    'angular.vertilize',
    'risevision.common.loading',
    'risevision.common.i18n',
    'risevision.apps.partials',
    'risevision.apps.config',
    'risevision.apps.services',
    'risevision.apps.controllers',
    'risevision.apps.launcher.controllers',
    'risevision.apps.launcher.directives',
    'risevision.apps.launcher.services',
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
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function storeRouteConfig($urlRouterProvider, $stateProvider,
      $locationProvider) {

      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/');

      // Use $stateProvider to configure states.
      $stateProvider.state('apps', {
        template: '<div ui-view></div>'
      })

      .state('apps.launcher', {
        abstract: true,
        template: '<div class="app-launcher" ui-view></div>'
      })

      .state('apps.launcher.unauthorized', {
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/login.html');
        }]
      })

      .state('apps.launcher.unregistered', {
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/signup.html');
        }]
      })

      .state('apps.launcher.home', {
        url: '/',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/app-launcher.html');
        }],
        controller: 'HomeCtrl',
        resolve: {
          canAccessApps: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
            }
          ]
        }
      })

      .state('apps.launcher.support', {
        url: '/support',
        controller: ['$state', 'canAccessApps', 'supportFactory',
          function ($state, canAccessApps, supportFactory) {
            canAccessApps().then(function () {
              supportFactory.handlePrioritySupportAction();
              $state.go('apps.launcher.home');
            });
          }
        ]
      })

      .state('apps.launcher.sendnote', {
        url: '/send-note',
        controller: ['$state', 'canAccessApps', 'supportFactory',
          function ($state, canAccessApps, supportFactory) {
            canAccessApps().then(function () {
              supportFactory.handleSendUsANote();
              $state.go('apps.launcher.home');
            });
          }
        ]
      })

      .state('apps.launcher.signup', {
        url: '/signup',
        controller: ['$state', function ($state) {
          $state.go('apps.launcher.home');
        }]
      })

      .state('apps.launcher.signin', {
        url: '/signin',
        controller: 'SignInCtrl'
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
        template: '<div class="container displays-app" ui-view ' +
          'off-canvas-content></div>'
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
          canAccessApps: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
            }
          ]
        }
      })

      .state('apps.displays.add', {
        url: '/displays/add',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/displays/display-add.html');
        }],
        controller: 'displayAdd',
        resolve: {
          canAccessApps: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
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
        template: '<div class="editor-app" ui-view ' +
          'off-canvas-content></div>'
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

      .state('apps.editor.workspace', {
        url: '/editor/workspace/:presentationId/:copyPresentation',
        abstract: true,
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get('partials/editor/workspace.html');
        }],
        controller: 'WorkspaceController',
        resolve: {
          presentationInfo: ['canAccessApps', 'editorFactory',
            '$stateParams', '$location',
            function (canAccessApps, editorFactory, $stateParams,
              $location) {
              return canAccessApps().then(function () {
                if ($stateParams.presentationId && $stateParams.presentationId !==
                  'new') {
                  return editorFactory.getPresentation($stateParams
                    .presentationId);
                } else if (!$stateParams.copyPresentation) {
                  var copyOf = $location.search().copyOf;
                  if (copyOf) {
                    return editorFactory.copyTemplate(null, copyOf);
                  }
                  editorFactory.openPresentationProperties();
                  return editorFactory.newPresentation();
                } else {
                  editorFactory.openPresentationProperties();
                  return editorFactory.presentation;
                }
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
        controller: 'ArtboardController',
        resolve: {
          canAccess: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
            }
          ]
        }
      })

      .state('apps.editor.workspace.htmleditor', {
        url: '/htmleditor',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/editor/html-editor.html');
        }],
        controller: 'HtmlEditorController',
        resolve: {
          canAccess: ['canAccessApps',
            function (canAccessApps) {
              return canAccessApps();
            }
          ]
        }
      })

      // storage
      .state('apps.storage', {
        url: '?cid',
        abstract: true,
        template: '<div class="storage-app" ui-view ' +
          'off-canvas-content></div>'
      })

      .state('apps.storage.home', {
        url: '/storage',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get('partials/storage/home.html');
        }],
        controller: 'StorageController',
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
  .run(['$rootScope', '$state', '$modalStack',
    function ($rootScope, $state, $modalStack) {

      $rootScope.$on('$stateChangeStart', function () {
        $modalStack.dismissAll();
      });

      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('apps.launcher.unauthorized');
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'apps.schedules.list' ||
          $state.current.name === 'apps.editor.list' ||
          $state.current.name === 'apps.displays.list' ||
          $state.current.name === 'apps.displays.alerts' ||
          $state.current.name === 'apps.storage.home' ||
          $state.current.name === 'apps.launcher.home') {

          $state.go($state.current, null, {
            reload: true
          });
        }
      });
    }
  ])
  // .config(['showErrorsConfigProvider',
  //   function (showErrorsConfigProvider) {
  //     showErrorsConfigProvider.trigger('keypress');
  //   }
  // ])
;

angular.module('risevision.apps.services', []);
angular.module('risevision.apps.controllers', []);

angular.module('risevision.apps.launcher.controllers', []);
angular.module('risevision.apps.launcher.directives', []);
angular.module('risevision.apps.launcher.services', []);


angular.module('risevision.schedules.services', [
  'risevision.common.header',
  'risevision.common.gapi'
]);
angular.module('risevision.schedules.filters', []);
angular.module('risevision.schedules.directives', [
  'risevision.schedules.filters'
]);
angular.module('risevision.schedules.controllers', []);


angular.module('risevision.displays.services', [
  'risevision.common.header',
  'risevision.common.gapi'
]);
angular.module('risevision.displays.filters', []);
angular.module('risevision.displays.directives', [
  'risevision.displays.filters'
]);
angular.module('risevision.displays.controllers', []);


angular.module('risevision.editor.services', [
  'risevision.common.header',
  'risevision.common.gapi'
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
angular.module('risevision.storage.directives', [
  'ui.bootstrap'
]);
angular.module('risevision.storage.controllers', []);
angular.module('risevision.storage.filters', []);
