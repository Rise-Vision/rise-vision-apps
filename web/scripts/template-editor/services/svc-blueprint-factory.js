'use strict';

angular.module('risevision.template-editor.services')
  .factory('blueprintFactory', ['$http', 'BLUEPRINT_URL',
    function ($http, BLUEPRINT_URL) {
      var factory = {};

      factory.load = function (productCode) {
        var url = BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

        return $http.get(url)
          .then(function (response) {
            factory.blueprintData = response.data;

            return factory.blueprintData;
          });
      };

      factory.hasBranding = function () {
        return (!!factory.blueprintData && factory.blueprintData.branding === true);
      };

      return factory;
    }
  ]);
