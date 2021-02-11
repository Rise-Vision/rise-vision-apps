'use strict';

angular.module('risevision.common.header.services')
  .factory('companySettingsFactory', ['$modal', '$templateCache', 'userState', 'getCoreCountries',
    function ($modal, $templateCache, userState, getCoreCountries) {
      var factory = {};

      factory.openCompanySettings = function () {
        return $modal.open({
          template: $templateCache.get('partials/common-header/company-settings-modal.html'),
          controller: 'CompanySettingsModalCtrl',
          size: 'lg',
          resolve: {
            companyId: function () {
              return userState.getSelectedCompanyId();
            },
            countries: function () {
              return getCoreCountries();
            }
          }
        });
      };

      return factory;
    }
  ]);
