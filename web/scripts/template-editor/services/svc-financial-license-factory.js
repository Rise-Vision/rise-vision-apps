'use strict';

angular.module('risevision.template-editor.services')
  .constant('NEED_FINANCIAL_DATA_LICENSE', ['rise-data-financial'])
  .constant('CONTACT_US_URL', 'https://www.risevision.com/contact-us')
  .factory('financialLicenseFactory', ['$window', '$modal', '$templateCache', 'blueprintFactory',
    'NEED_FINANCIAL_DATA_LICENSE', 'CONTACT_US_URL',
    function ($window, $modal, $templateCache, blueprintFactory, NEED_FINANCIAL_DATA_LICENSE, CONTACT_US_URL) {
      var factory = {};

      var _needsFinancialDataLicense = function () {
        if (!blueprintFactory.blueprintData) {
          return false;
        }

        return _.some(blueprintFactory.blueprintData.components, function (component) {
          return _.includes(NEED_FINANCIAL_DATA_LICENSE, component.type);
        });
      };

      var _showFinancialDataLicenseRequiredMessage = function () {
        var modalInstance = $modal.open({
          template: $templateCache.get('partials/template-editor/more-info-modal.html'),
          controller: 'confirmInstance',
          windowClass: 'madero-style centered-modal financial-data-license-message',
          resolve: {
            confirmationTitle: function () {
              return 'Financial Data License Required';
            },
            confirmationMessage: function () {
              return 'This template requires a Financial Data License to show on your Display(s), if you need one please contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> to purchase.';
            },
            confirmationButton: function () {
              return 'Contact Us';
            },
            cancelButton: function () {
              return 'Close';
            }
          }
        });

        modalInstance.result.then(function () {
          modalInstance.dismiss();
          $window.open(CONTACT_US_URL, '_blank');
        });
      };


      factory.checkFinancialDataLicenseMessage = function () {
        if (_needsFinancialDataLicense()) {
          _showFinancialDataLicenseRequiredMessage();
        }
      };

      return factory;
    }
  ]);
