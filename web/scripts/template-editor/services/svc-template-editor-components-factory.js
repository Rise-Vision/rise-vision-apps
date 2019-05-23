'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorComponentsFactory', ['templateEditorFactory',
    function (templateEditorFactory) {
      var factory = {};
      factory.components = {};

      factory.preConfigureComponentInstance = function(componentBlueprint) {
        if (factory.components[componentBlueprint.type] && 
          typeof factory.components[componentBlueprint.type].preConfigureComponentInstance === 'function') {
          factory.components[componentBlueprint.type].preConfigureComponentInstance(componentBlueprint);
        }        
      }
      return factory;
    }
  ]);
