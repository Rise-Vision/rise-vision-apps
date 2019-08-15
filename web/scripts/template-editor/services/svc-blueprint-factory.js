'use strict';

angular.module('risevision.template-editor.services')
  .factory('blueprintFactory', ['$http', 'BLUEPRINT_URL',
    function ($http, BLUEPRINT_URL) {
      var factory = {};

      factory.load = function (productCode) {
        var url = BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

        return $http.get(url)
          .then(function (blueprintData) {
            factory.blueprintData = blueprintData.data;

            return factory.blueprintData;
          });
      };

      factory.getBlueprintData = function (componentId, attributeKey) {
        var components = factory.blueprintData.components;
        var component = _.find(components, {
          id: componentId
        });

        if (!component || !component.attributes) {
          return null;
        }

        var attributes = component.attributes;

        // if the attributeKey is not provided, it returns the full attributes structure
        if (!attributeKey) {
          return attributes;
        }

        var attribute = attributes[attributeKey];
        return attribute && attribute.value;
      };

      return factory;
    }
  ]);
