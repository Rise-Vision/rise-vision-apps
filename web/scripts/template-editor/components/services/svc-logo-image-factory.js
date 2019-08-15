'use strict';

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', ['templateEditorFactory',
    function (templateEditorFactory) {
      var factory = {};

      factory.getAttributeData = function (key, $scope) {
        return [];
      };

      factory.setAttributeData = function (key, value, $scope) {
        // $scope.setAttributeData(factory.componentId, key, value);
      };

      return factory;
    }
  ]);
