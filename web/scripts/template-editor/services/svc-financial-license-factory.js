'use strict';

angular.module('risevision.template-editor.services')
  .constant('NEED_FINANCIAL_DATA_LICENSE', ['rise-data-financial'])
  .constant('CONTACT_US_URL', 'https://www.risevision.com/contact-us?form_selected=sales&content_hide=true')
  .factory('financialLicenseFactory', ['$window', '$modal', '$templateCache', 'blueprintFactory',
    'NEED_FINANCIAL_DATA_LICENSE', 'CONTACT_US_URL',
    function ($window, $modal, $templateCache, blueprintFactory, NEED_FINANCIAL_DATA_LICENSE, CONTACT_US_URL) {
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
        var modalInstance = $modal.open({
          template: $templateCache.get('partials/template-editor/more-info-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'madero-style centered-modal financial-data-license-message',
          resolve: {
            confirmationTitle: function () {
              return 'Financial Data License Required';
            },
            confirmationMessage: function () {
              return 'This Template requires a Financial Data License to show on your Display(s). Contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a 30 day free trial.';
            },
            confirmationButton: function () {
              return 'Get a 30 Day Free Trial';
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

      return factory;
    }
  ]);
