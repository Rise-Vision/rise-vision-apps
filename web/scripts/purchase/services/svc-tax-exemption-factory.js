(function (angular) {

  'use strict';
  angular.module('risevision.apps.purchase')
    .factory('taxExemptionFactory', ['storeService', 'userState',
      function (storeService, userState) {
        var factory = {};

        // Stop spinner - workaround for spinner not rendering
        factory.loading = false;

        factory.init = function () {
          factory.taxExemption = {};
        };

        factory.submitCertificate = function () {
          factory.taxExemptionError = null;
          factory.loading = true;

          return storeService.uploadTaxExemptionCertificate(factory.taxExemption.file)
            .then(function (blobKey) {
              return storeService.addTaxExemption(userState.getSelectedCompanyId(), factory.taxExemption, blobKey);
            }).catch(function (error) {
              factory.taxExemptionError = error.message ||
                'An error ocurred while submitting your tax exemption. Please try again.';
            }).finally(function () {
              factory.loading = false;
            });

        };

        return factory;
      }
    ]);

})(angular);
