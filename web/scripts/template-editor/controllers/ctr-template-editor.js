'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', 'templateEditorFactory', 'presentation',
    function ($scope, templateEditorFactory, presentation) {
      $scope.factory = templateEditorFactory;
      $scope.presentation = presentation;

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
        var attributeData = $scope.presentation.templateAttributeData;

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
