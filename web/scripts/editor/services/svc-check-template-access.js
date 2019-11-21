'use strict';

angular.module('risevision.editor.services')
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .factory('checkTemplateAccess', ['$modal', 'storeAuthorization', 'plansFactory',
    'TEMPLATE_LIBRARY_PRODUCT_CODE',
    function ($modal, storeAuthorization, plansFactory, TEMPLATE_LIBRARY_PRODUCT_CODE) {
      var _openExpiredModal = function (isHtmlTemplate) {
        var modalObject = {
          controller: 'confirmModalController',
          resolve: {
            confirmationTitle: function () {
              return 'Display License Required';
            },
            confirmationMessage: function () {
              return 'Starting January 1, 2020 this Presentation or Template will require a Display License to show on your Display(s). Please subscribe or contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a quote.';
            },
            confirmationButton: function () {
              return 'Subscribe';
            },
            cancelButton: null
          }
        };

        if (isHtmlTemplate) {
          modalObject.templateUrl = 'partials/template-editor/more-info-modal.html';
          modalObject.windowClass = 'madero-style centered-modal display-license-required-message';
        } else {
          modalObject.templateUrl = 'partials/components/confirm-modal/confirm-modal.html';
          modalObject.windowClass = 'display-license-required-message';
        }

        var modalInstance = $modal.open(modalObject);
        
        modalInstance.result.then(function () {
          modalInstance.dismiss();
          plansFactory.showPlansModal();
        });
      };

      return function (isHtmlTemplate) {
        return storeAuthorization.check(TEMPLATE_LIBRARY_PRODUCT_CODE)
          .catch(function () {
            _openExpiredModal(isHtmlTemplate);
          });
      };
    }
  ]);
