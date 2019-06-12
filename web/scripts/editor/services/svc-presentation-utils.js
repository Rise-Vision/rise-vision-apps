'use strict';

angular.module('risevision.editor.services')
  .constant('HTML_PRESENTATION_TYPE', 'HTML Template')
  .factory('presentationUtils', ['HTML_TEMPLATE_TYPE', 'HTML_PRESENTATION_TYPE',
    '$state', '$window',
    function (HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE, $state, $window) {
      var factory = {};

      factory.isMobileBrowser = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          $window.navigator.userAgent
        );
      };

      factory.isHtmlTemplate = function (product) {
        return product.productTag && product.productTag.indexOf(HTML_TEMPLATE_TYPE) >= 0;
      };

      factory.isHtmlPresentation = function (presentation) {
        return presentation.presentationType === HTML_PRESENTATION_TYPE;
      };

      factory.openPresentation = function (presentation) {
        if (presentation.presentationType !== HTML_PRESENTATION_TYPE) {
          $state.go('apps.editor.workspace.artboard', {
            presentationId: presentation.id
          });
        } else {
          $state.go('apps.editor.templates.edit', {
            presentationId: presentation.id
          });
        }
      };

      return factory;
    }
  ]);
