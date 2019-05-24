'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorComponentsFactory', ['userState',
    function (userState) {
      var factory = {};
      factory.components = {};

      factory.getSetupData = function (components) {
        var company = userState.getCopyOfSelectedCompany(true);
        var displayAddress = {
          city: company.city,
          province: company.province,
          country: company.country,
          postalCode: company.postalCode
        };

        var setupData = [];
        angular.forEach(components, function (componentBlueprint) {
          if (factory.components[componentBlueprint.type] &&
            factory.components[componentBlueprint.type].initDisplayAddres) {
            setupData.push({
              id: componentBlueprint.id,
              displayAddress: displayAddress
            });
          }
        });
        return setupData;
      };

      return factory;
    }
  ]);
