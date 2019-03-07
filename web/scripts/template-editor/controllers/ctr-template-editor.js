'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', 'templateEditorFactory',
    function ($scope, templateEditorFactory) {
      $scope.factory = templateEditorFactory;

      $scope.getBlueprintData = function(componentId, attributeKey) {
        var components = $scope.factory.blueprintData.components;
        var component = _.find(components, {id: componentId});

        if(!component || !component.attributes) {
          return null;
        }

        var attributes = component.attributes;

        // if the attributeKey is not provided, it returns the full attributes structure
        if(!attributeKey) {
          return attributes;
        }

        var attribute = attributes[attributeKey];
        return attribute && attribute.value;
      }

      $scope.getAttributeData = function(componentId, attributeKey) {
        var component = _componentFor(componentId);

        // if the attributeKey is not provided, it returns the full component structure
        return attributeKey ? component[attributeKey] : component;
      }

      $scope.setAttributeData = function(componentId, attributeKey, value) {
        var component = _componentFor(componentId);

        component[attributeKey] = value;
      }

      function _componentFor(componentId) {
        var attributeData = $scope.factory.presentation.templateAttributeData;

        if(!attributeData.components) {
          attributeData.components = [];
        }

        var component = _.find(attributeData.components, {id: componentId});

        if(!component) {
          component = { id: componentId };

          attributeData.components.push(component);
        }

        return component;
      }
    }
  ]);
