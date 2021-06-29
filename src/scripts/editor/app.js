'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.editor', {
          abstract: true,
          template: '<div class="editor-app" ui-view></div>'
        })

        .state('apps.editor.home', {
          url: '/editor',
          redirectTo: 'apps.editor.list'
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
            presentationId: ''
          },
          resolve: {
            presentationInfo: ['canAccessApps', 'editorFactory', '$stateParams',
              function (canAccessApps, editorFactory, $stateParams) {
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
        });

    }
  ]);

angular.module('risevision.editor.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.store.product',
  'risevision.apps.config',
  'risevision.displays.services'
]);
angular.module('risevision.editor.filters', []);
angular.module('risevision.editor.directives', [
  'risevision.editor.filters'
]);
angular.module('risevision.editor.controllers', []);
