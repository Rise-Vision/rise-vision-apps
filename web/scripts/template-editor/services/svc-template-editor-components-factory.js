'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorComponentsFactory', ['templateEditorFactory', 'userState',
    function (templateEditorFactory,userState) {
      var factory = {};
      factory.components = {};

      factory.getPrePopulateData = function (components) {
        var company = userState.getCopyOfSelectedCompany(true);
        var displayAddress = {
          city: company.city,
          province: company.province,
          country: company.country,
          postalCode: company.postalCode
        };

        var prePopulateData = [];
        angular.forEach(components, function (componentBlueprint) {
          if (factory.components[componentBlueprint.type] &&
            factory.components[componentBlueprint.type].prePopulateDisplayAddres) {
            prePopulateData.push({id: componentBlueprint.id,displayAddress: displayAddress});
          }          
        });
        return prePopulateData;
      };
      return factory;
    }
  ]);