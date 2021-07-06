'use strict';

angular.module('risevision.template-editor.services')
  .constant('NEED_FINANCIAL_DATA_LICENSE', ['rise-data-financial'])
  .constant('CONTACT_US_URL', 'https://www.risevision.com/contact-us?form_selected=sales&content_hide=true')
  .factory('financialLicenseFactory', ['$window', 'blueprintFactory',
    'NEED_FINANCIAL_DATA_LICENSE', 'CONTACT_US_URL', 'ngModalService',
    function ($window, blueprintFactory, NEED_FINANCIAL_DATA_LICENSE, CONTACT_US_URL, ngModalService) {
      var factory = {};

      factory.needsFinancialDataLicense = function () {
        if (!blueprintFactory.blueprintData) {
          return false;
        }

        return _.some(blueprintFactory.blueprintData.components, function (component) {
          return _.includes(NEED_FINANCIAL_DATA_LICENSE, component.type);
        });
      };

      factory.showFinancialDataLicenseRequiredMessage = function () {
        ngModalService.confirm('Financial Data License Required',
          'This Presentation requires a Financial Data License to show on your Display(s). Contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a 30 day free trial.',
          'Get a 30 Day Free Trial', 
          'Close'
        ).then(function () {
          $window.open(CONTACT_US_URL, '_blank');
        });
      };

      return factory;
    }
  ]);
