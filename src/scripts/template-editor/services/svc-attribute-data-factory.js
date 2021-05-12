'use strict';

angular.module('risevision.template-editor.services')
  .factory('attributeDataFactory', ['templateEditorFactory', 'blueprintFactory',
    function (templateEditorFactory, blueprintFactory) {
      var factory = {};

      factory.getBlueprintData = function (componentId, attributeKey) {
        return blueprintFactory.getBlueprintData(componentId, attributeKey);
      };

      factory.getAttributeData = function (componentId, attributeKey) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, false);

        if (component.element && component.element.attributes) {
          return attributeKey ? component.element.attributes[attributeKey] : component.element.attributes;
        } else {
          // if the attributeKey is not provided, it returns the full component structure
          return attributeKey ? component[attributeKey] : component;
        }
      };

      factory.getAvailableAttributeData = function (componentId, attributeName) {
        var result = factory.getAttributeData(componentId, attributeName);

        if (angular.isUndefined(result)) {
          result = factory.getBlueprintData(componentId, attributeName);
        }

        return result;
      };

      factory.setAttributeData = function (componentId, attributeKey, value) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, true);

        if (component.element) {
          if (!component.element.attributes) {
            component.element.attributes = {};
          }

          component.element.attributes[attributeKey] = value;
        } else {
          component[attributeKey] = value;
        }
      };

      factory.getAttributeDataGlobal = function (attributeKey) {
        return templateEditorFactory.presentation.templateAttributeData[attributeKey];
      };

      factory.setAttributeDataGlobal = function (attributeKey, value) {
        templateEditorFactory.presentation.templateAttributeData[attributeKey] = value;
      };

      // updateAttributeData: do not update the object on getAttributeData
      // or it will unnecessarily trigger hasUnsavedChanges = true
      var _componentFor = function (componentId, updateAttributeData) {
        var attributeData = templateEditorFactory.presentation.templateAttributeData;
        var component;

        if (componentId.indexOf(' ') !== -1) {
          var tokens = componentId.split(' ');
          var playlistId = tokens[0];
          var playlist = _componentFor(playlistId, updateAttributeData);

          return playlist.items[tokens[1]];
        } else if (attributeData.components) {
          component = _.find(attributeData.components, {
            id: componentId
          });
        } else if (updateAttributeData) {
          attributeData.components = [];
        }

        if (!component) {
          component = {
            id: componentId
          };

          if (updateAttributeData) {
            attributeData.components.push(component);
          }
        }

        return component;
      };

      factory.getComponentIds = function (filter) {
        var components = blueprintFactory.blueprintData.components;

        var filteredComponents = _.filter(components, filter);

        return _.map(filteredComponents, function (component) {
          return component.id;
        });
      };

      return factory;
    }
  ]);
