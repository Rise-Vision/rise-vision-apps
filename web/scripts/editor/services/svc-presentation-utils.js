'use strict';

angular.module('risevision.editor.services')
  .constant('HTML_PRESENTATION_TYPE', 'HTML Template')
  .factory('presentationUtils', ['HTML_TEMPLATE_TYPE', 'HTML_PRESENTATION_TYPE',
    '$state', 'checkTemplateAccess', 'plansFactory',
    function (HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE, $state, checkTemplateAccess, plansFactory) {
      var factory = {};

      factory.isHtmlTemplate = function (product) {
        return product.productTag && product.productTag.indexOf(HTML_TEMPLATE_TYPE) >= 0;
      };

      factory.isHtmlPresentation = function (presentation) {
        return presentation.presentationType === HTML_PRESENTATION_TYPE;
      };

      factory.openPresentation = function(presentation) {
        if (presentation.presentationType !== HTML_PRESENTATION_TYPE) {
          $state.go('apps.editor.workspace.artboard', { presentationId: presentation.id });
        } else {
          checkTemplateAccess(presentation.productCode)
            .then(function () {
              $state.go('apps.editor.templates.edit', { presentationId: presentation.id });
            })
            .catch(function () {
              plansFactory.showPlansModal();
            });
        }
      };

      return factory;
    }
  ]);
