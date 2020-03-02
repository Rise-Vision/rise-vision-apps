'use strict';

angular.module('risevision.template-editor.services')
  .factory('blueprintFactory', ['$q', '$http', 'BLUEPRINT_URL',
    function ($q, $http, BLUEPRINT_URL) {
      var factory = {};

      var _blueprints = {};
      factory.loadingBlueprint = false;

      factory.getBlueprintCached = function (productCode) {
        var blueprint = _blueprints[productCode];

        if (blueprint) {
          factory.blueprintData = blueprint;

          return $q.resolve(blueprint);
        } else {
          return _getBlueprint(productCode);
        }
      };

      var _getBlueprint = function (productCode) {
        var url = BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

        //show loading spinner
        factory.loadingBlueprint = true;

        return $http.get(url)
          .then(function (response) {
            factory.blueprintData = response.data;

            _blueprints[productCode] = factory.blueprintData;

            return factory.blueprintData;
          })
          .finally(function () {
            factory.loadingBlueprint = false;
          });
      };

      factory.isPlayUntilDone = function (productCode) {
        return factory.getBlueprintCached(productCode)
          .then(function () {
            return !!(factory.blueprintData && factory.blueprintData.playUntilDone);
          });
      };

      factory.hasBranding = function () {
        return (!!factory.blueprintData && factory.blueprintData.branding === true);
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

      factory.getLogoComponents = function () {
        var components = factory.blueprintData.components;

        return _.filter(components, function (c) {
          return c.type === 'rise-image' && (c.attributes && c.attributes['is-logo'] && c
            .attributes['is-logo'].value === 'true');
        });
      };

      factory.getHelpText = function (componentId) {
        var component = _.find(factory.blueprintData.components, {
          id: componentId
        });
        return component && component.helpText;
      };

      return factory;
    }
  ]);
