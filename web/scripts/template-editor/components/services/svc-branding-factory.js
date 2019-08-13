'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['templateEditorFactory',
    function (templateEditorFactory) {
      var factory = {};

      var _hasBrandingElements = function () {
        var blueprint = templateEditorFactory.blueprintData;

        return !!blueprint && blueprint.branding === true;
      };

      factory.getBrandingComponent = function () {
        if (_hasBrandingElements()) {
          return {
            type: 'rise-branding'
          };
        }

        return null;
      };

      return factory;
    }
  ]);
