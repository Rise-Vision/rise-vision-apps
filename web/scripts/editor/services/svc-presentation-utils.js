'use strict';

angular.module('risevision.editor.services')
  .constant('HTML_PRESENTATION_TYPE', 'HTML Template')
  .factory('presentationUtils', ['HTML_TEMPLATE_TYPE', 'HTML_PRESENTATION_TYPE',
    function (HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE) {
      var factory = {};

      factory.isHtmlTemplate = function (product) {
        return product.productTag && product.productTag.indexOf(HTML_TEMPLATE_TYPE) >= 0;
      };

      factory.isHtmlPresentation = function (presentation) {
        return presentation.presentationType === HTML_PRESENTATION_TYPE;
      };

      return factory;
    }
  ]);
