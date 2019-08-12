'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['templateEditorFactory',
    function (templateEditorFactory) {
      var factory = {};

      factory.getBrandingComponent = function () {
        if (factory.hasBrandingElements()) {
          return {
            type: 'rise-branding'
          };
        }

        return null;
      };

      factory.hasBrandingElements = function () {
        var blueprint = templateEditorFactory.blueprintData;

        return !!blueprint && blueprint.branding === true;
      };

      return factory;
    }
  ]);
