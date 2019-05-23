'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorComponentsFactory', ['templateEditorFactory',
    function (templateEditorFactory) {
      var factory = {};
      factory.components = {};

      factory.getSetupData = function (components) {
        var setupData = []
        angular.forEach(components, function (componentBlueprint) {

          if (factory.components[componentBlueprint.type] &&
            typeof factory.components[componentBlueprint.type].getSetupData === 'function') {

            var data = factory.components[componentBlueprint.type].getSetupData(componentBlueprint);
            if (data) {
              setupData.push(data);
            }
          }
        });
        return setupData;
      }
      return factory;
    }
  ]);
