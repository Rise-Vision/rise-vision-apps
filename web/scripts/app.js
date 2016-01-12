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
    'risevision.widget.common.storage-selector',
    'risevision.widget.common.background-image-setting',
    'risevision.widget.common',
    'ui.codemirror',
    'angular.vertilize',
    'risevision.common.loading',
    'risevision.common.i18n',
    'risevision.apps.partials',
    'risevision.apps.config',
    'risevision.apps.controllers',
    'risevision.apps.launcher.controllers',
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
    'risevision.editor.directives'
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

      .state('apps.launcher.home', {
        url: '/',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/app-launcher.html');
        }],
        controller: 'HomeCtrl'
      })

      .state('apps.launcher.login', {
        url: '/login',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/login.html');
        }]
      })

      .state('apps.launcher.signup', {
        url: '/signup',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/app-launcher.html');
        }],
        controller: 'SignUpCtrl'
      })

      .state('apps.launcher.signin', {
        url: '/signin',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/launcher/app-launcher.html');
        }],
        controller: 'SignInCtrl'
      })

      // schedules
      .state('apps.schedules', {
        abstract: true,
        template: '<div class="container schedules-app" ui-view></div>'
      })

      .state('apps.schedules.home', {
        url: '/schedules',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/schedules/landing-page.html');
        }],
        controller: ['canAccessSchedules', '$state',

          function (canAccessSchedules, $state) {
            canAccessSchedules().then(function () {
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
          canAccessSchedules: ['canAccessSchedules',
            function (canAccessSchedules) {
              return canAccessSchedules();
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
          scheduleInfo: ['canAccessSchedules', 'scheduleFactory',
            '$stateParams',
            function (canAccessSchedules, scheduleFactory, $stateParams) {
              return canAccessSchedules().then(function () {
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
          scheduleInfo: ['canAccessSchedules', 'scheduleFactory',
            function (canAccessSchedules, scheduleFactory) {
              return canAccessSchedules().then(scheduleFactory.newSchedule);
            }
          ]
        }
      })

      // displays
      .state('apps.displays', {
        abstract: true,
        template: '<div class="container displays-app" ui-view ' +
          'off-canvas-content></div>'
      })

      .state('apps.displays.home', {
        url: '/displays',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/displays/landing-page.html');
        }],
        controller: ['canAccessDisplays', '$state',

          function (canAccessDisplays, $state) {
            canAccessDisplays().then(function () {
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
          canAccessDisplays: ['canAccessDisplays',
            function (canAccessDisplays) {
              return canAccessDisplays();
            }
          ]
        }
      })

      .state('apps.displays.change', {
        url: '/displays/change/:displayId/:companyId',
        controller: ['canAccessDisplays', 'userState', '$stateParams',
          '$state', '$location',
          function (canAccessDisplays, userState, $stateParams, $state,
            $location) {
            return canAccessDisplays().then(function () {
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
          canAccessDisplays: ['canAccessDisplays',
            function (canAccessDisplays) {
              return canAccessDisplays();
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
          canAccessDisplays: ['canAccessDisplays',
            function (canAccessDisplays) {
              return canAccessDisplays();
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
          canAccessDisplays: ['canAccessDisplays',
            function (canAccessDisplays) {
              return canAccessDisplays();
            }
          ]
        }
      })

      // editor
      .state('apps.editor', {
        abstract: true,
        template: '<div class="editor-app" ui-view ' +
          'off-canvas-content></div>'
      })

      .state('apps.editor.home', {
        url: '/editor',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/editor/landing-page.html');
        }],
        controller: ['canAccessEditor', '$state',

          function (canAccessEditor, $state) {
            canAccessEditor().then(function () {
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
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
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
          presentationInfo: ['canAccessEditor', 'editorFactory',
            '$stateParams', '$location',
            function (canAccessEditor, editorFactory, $stateParams,
              $location) {
              return canAccessEditor().then(function () {
                if ($stateParams.presentationId && $stateParams.presentationId !==
                  'new') {
                  return editorFactory.getPresentation($stateParams
                    .presentationId);
                } else if (!$stateParams.copyPresentation) {
                  var copyOf = $location.search().copyOf;
                  if (copyOf) {
                    return editorFactory.newCopyOf(copyOf);
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
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
            }
          ]
        }
      })

      .state('apps.editor.workspace.htmleditor', {
        url: '',
        templateProvider: ['$templateCache', function ($templateCache) {
          return $templateCache.get(
            'partials/editor/html-editor.html');
        }],
        controller: 'HtmlEditorController',
        resolve: {
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
            }
          ]
        }
      });

    }
  ])
  .run(['$rootScope', '$state', 'userState',
    function ($rootScope, $state, userState) {
      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('apps.launcher.home');
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'apps.schedules.list' ||
          $state.current.name === 'apps.schedules.home' ||
          $state.current.name === 'apps.editor.list' ||
          $state.current.name === 'apps.editor.home' ||
          $state.current.name === 'apps.displays.list' ||
          $state.current.name === 'apps.displays.home') {

          $state.go($state.current.name, null, {
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

angular.module('risevision.apps.controllers', []);

angular.module('risevision.apps.launcher.controllers', []);
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
