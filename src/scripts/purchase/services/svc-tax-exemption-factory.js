(function (angular) {

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('taxExemptionFactory', ['userState', 'storeService',
      function (userState, storeService) {
        var factory = {};

        factory.init = function (submitCallback) {
          factory.loading = false;
          factory.taxExemption = {
            callback: submitCallback
          };
        };

        factory.submitTaxExemption = function () {
          factory.taxExemption.error = null;

          factory.loading = true;

          return storeService.uploadTaxExemptionCertificate(factory.taxExemption.file)
            .then(function (blobKey) {
              return storeService.addTaxExemption(userState.getSelectedCompanyId(), factory.taxExemption,
                blobKey);
            })
            .then(function () {
              factory.taxExemption.sent = true;

              if (factory.taxExemption.callback) {
                factory.taxExemption.callback();
              }
            })
            .catch(function (error) {
              factory.taxExemption.error = error.message || 'Something went wrong. Please try again.';
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        return factory;
      }
    ]);

})(angular);
