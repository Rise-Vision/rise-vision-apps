'use strict';

angular.module('risevision.editor.services')
  .constant('HTML_PRESENTATION_TYPE', 'HTML Template')
  .factory('presentationUtils', ['HTML_TEMPLATE_TYPE', 'HTML_PRESENTATION_TYPE', '$window',
    function (HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE, $window) {
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

      return factory;
    }
  ]);
