'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.editor.templates', {
          url: '/templates',
          abstract: true,
          template: '<div class="templates-app" ui-view></div>'
        })

        .state('apps.editor.templates.edit', {
          url: '/edit/:presentationId/:productId',
          component: 'ngTemplateEditor',
          reloadOnSearch: false,
          params: {
            productDetails: null,
            productId: ''
          },
          resolve: {
            presentationInfo: ['$stateParams', 'canAccessApps', 'editorFactory', 'templateEditorFactory',
              'financialLicenseFactory',
              function ($stateParams, canAccessApps, editorFactory, templateEditorFactory,
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
                    } else if (!templateEditorFactory.presentation || templateEditorFactory.presentation.id !==
                      $stateParams.presentationId) {
                      return templateEditorFactory.getPresentation($stateParams.presentationId);
                    }
                  })
                  .then(function () {
                    if ($stateParams.presentationId === 'new' &&
                      financialLicenseFactory.needsFinancialDataLicense()) {
                      financialLicenseFactory.showFinancialDataLicenseRequiredMessage();
                    }
                  });
              }
            ]
          }
        });

    }
  ]);

// Template Editor
angular.module('risevision.template-editor.services', [
  'risevision.common.config',
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.editor.services',
  'risevision.schedules.services',
  'risevision.storage.services'
]);
angular.module('risevision.template-editor.filters', []);
angular.module('risevision.template-editor.directives', [
  'risevision.template-editor.services',
  'risevision.template-editor.filters'
]);
